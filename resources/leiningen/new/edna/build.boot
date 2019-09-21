(set-env!
  :source-paths #{"src"}
  :resource-paths #{"resources"}
  :dependencies '[[org.clojure/clojure "1.10.1" :scope "provided"]
                  [adzerk/boot-cljs "2.1.5" :scope "test"]
                  [adzerk/boot-reload "0.6.0" :scope "test"]
                  [pandeiro/boot-http "0.8.3" :scope "test"
                   :exclusions [org.clojure/clojure]]
                  [javax.xml.bind/jaxb-api "2.3.0" :scope "test"] ; necessary for Java 9 compatibility
                  [org.clojure/clojurescript "1.10.439" :scope "test"]
                  [edna "1.6.0"]])

(require
  '[edna.core]
  '[{{name}}.core]
  '[adzerk.boot-cljs :refer [cljs]]
  '[adzerk.boot-reload :refer [reload]]
  '[pandeiro.boot-http :refer [serve]]
  '[clojure.java.io :as io])

(deftask run []
  (comp
    (watch)
    (with-pass-thru _
      ({{name}}.core/-main))))

(deftask build []
  (let [output (io/file "target" "{{name}}.mp3")]
    (.mkdir (.getParentFile output))
    (with-pass-thru _
      (edna.core/export!
        ({{name}}.core/read-music)
        {:type :mp3
         :out output})
      (println "Built" (.getCanonicalPath output)))))

(def cljs-port 3000)

(deftask run-cljs []
  (comp
    (serve :dir "target/public" :port cljs-port)
    (watch)
    (reload)
    (cljs
      :optimizations :none
      :compiler-options {:asset-path "main.out"})
    (target)
    (with-pass-thru _
      (println (str "Serving on http://localhost:" cljs-port)))))

(deftask build-cljs []
  (comp
    (cljs :optimizations :advanced)
    (target)))

