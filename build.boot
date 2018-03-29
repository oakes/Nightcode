(defn read-deps-edn [aliases-to-include]
  (let [{:keys [paths deps aliases]} (-> "deps.edn" slurp clojure.edn/read-string)
        deps (->> (select-keys aliases aliases-to-include)
                  vals
                  (mapcat :extra-deps)
                  (into deps)
                  (reduce
                    (fn [deps [artifact info]]
                      (if-let [version (:mvn/version info)]
                        (conj deps
                          (transduce cat conj [artifact version]
                            (select-keys info [:scope :exclusions])))
                        deps))
                    []))]
    {:dependencies deps
     :source-paths (set paths)
     :resource-paths (set paths)}))

(let [{:keys [source-paths resource-paths dependencies]} (read-deps-edn [])]
  (set-env!
    :source-paths source-paths
    :resource-paths resource-paths
    :dependencies (into '[[adzerk/boot-cljs "2.1.4" :scope "test"]
                          [javax.xml.bind/jaxb-api "2.3.0" :scope "test"]
                          [orchestra "2017.11.12-1" :scope "test"]]
                        dependencies)
    :repositories (conj (get-env :repositories)
                    ["clojars" {:url "https://clojars.org/repo/"
                                :username (System/getenv "CLOJARS_USER")
                                :password (System/getenv "CLOJARS_PASS")}])))

(require
  '[orchestra.spec.test :refer [instrument]]
  '[adzerk.boot-cljs :refer [cljs]]
  '[clojure.java.io :as io])

(task-options!
  sift {:include #{#"\.jar$"}}
  pom {:project 'nightcode
       :version "2.5.9-SNAPSHOT"
       :description "An IDE for Clojure"
       :url "https://github.com/oakes/Nightcode"
       :license {"Public Domain" "http://unlicense.org/UNLICENSE"}}
  push {:repo "clojars"}
  aot {:namespace '#{nightcode.core
                     nightcode.lein}}
  jar {:main 'nightcode.core
       :manifest {"Description" "An IDE for Clojure and ClojureScript"
                  "Url" "https://github.com/oakes/Nightcode"}
       :file "project.jar"})

(deftask run []
  (comp
    (aot)
    (with-pass-thru _
      (require '[nightcode.core :refer [dev-main]])
      (instrument)
      ((resolve 'dev-main)))))

(def jar-exclusions
  ;; the standard exclusions don't work on windows,
  ;; because we need to use backslashes
  (conj boot.pod/standard-jar-exclusions
    #"(?i)^META-INF\\[^\\]*\.(MF|SF|RSA|DSA)$"
    #"(?i)^META-INF\\INDEX.LIST$"))

(deftask build []
  (comp (aot) (pom) (uber :exclude jar-exclusions) (jar) (sift) (target)))

(deftask build-cljs []
  (set-env!
    :resource-paths #(conj % "dev-resources")
    :dependencies #(into (set %) (:dependencies (read-deps-edn [:cljs]))))
  (comp
    (cljs :optimizations :advanced)
    (target)
    (with-pass-thru _
      (io/copy (io/file "target/public/paren-soup.js") (io/file "resources/public/paren-soup.js"))
      (io/copy (io/file "target/public/codemirror.js") (io/file "resources/public/codemirror.js")))))

(deftask local []
  (comp (pom) (jar) (install)))

(deftask deploy []
  (comp (pom) (jar) (push)))

