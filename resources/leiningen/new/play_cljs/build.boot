(set-env!
  :source-paths #{"src"}
  :resource-paths #{"resources"}
  :dependencies '[[org.clojure/clojure "1.10.1" :scope "provided"]
                  [adzerk/boot-cljs "2.1.5" :scope "test"]
                  [adzerk/boot-reload "0.6.0" :scope "test"]
                  [pandeiro/boot-http "0.8.3" :scope "test"]
                  [javax.xml.bind/jaxb-api "2.3.0" :scope "test"] ; necessary for Java 9 compatibility
                  ; project deps
                  [org.clojure/clojurescript "1.10.439" :scope "test"]
                  [play-cljs "1.3.1"]
                  [edna "1.6.0"]])

(require
  '[adzerk.boot-cljs :refer [cljs]]
  '[adzerk.boot-reload :refer [reload]]
  '[pandeiro.boot-http :refer [serve]])

(def cljs-port 3000)

(deftask run []
  (set-env! :resource-paths #(conj % "dev-resources"))
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

(deftask build []
  (set-env! :resource-paths #(conj % "prod-resources"))
  (comp (cljs :optimizations :advanced) (target)))

