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
    :dependencies (into '[[adzerk/boot-cljs "2.1.5" :scope "test"]
                          [javax.xml.bind/jaxb-api "2.3.0" :scope "test"]
                          [orchestra "2018.12.06-2" :scope "test"]
			  [org.openjfx/javafx-graphics "11.0.2" :classifier "win"]
			  [org.openjfx/javafx-graphics "11.0.2" :classifier "linux"]
			  [org.openjfx/javafx-graphics "11.0.2" :classifier "mac"]]
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
  sift {:include #{#"project.jar$"}}
  pom {:project 'nightcode
       :version "2.7.0"
       :description "An IDE for Clojure"
       :url "https://github.com/oakes/Nightcode"
       :license {"Public Domain" "http://unlicense.org/UNLICENSE"}}
  push {:repo "clojars"}
  aot {:namespace '#{nightcode.start
                     nightcode.core
                     nightcode.lein}}
  jar {:main 'nightcode.start
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
  (conj boot.pod/standard-jar-exclusions
    ;; the standard exclusions don't work on windows,
    ;; because we need to use backslashes
    #"(?i)^META-INF\\[^\\]*\.(MF|SF|RSA|DSA)$"
    #"(?i)^META-INF\\INDEX.LIST$"
    ;; exclude soundfont file from edna
    #".*\.sf2$"))

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

