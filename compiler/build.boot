(set-env!
  :source-paths #{"src"}
  :dependencies '[[adzerk/boot-cljs "1.7.228-1" :scope "test"]
                  ; project deps
                  [org.clojure/clojure "1.9.0-alpha4"]
                  [org.clojure/clojurescript "1.9.36"]])

(require
  '[adzerk.boot-cljs :refer [cljs]]
  '[clojure.java.io :as io])

(deftask build []
  (comp
    (cljs :optimizations :simple)
    (target)
    (with-pre-wrap fileset
      (let [from (io/file "target/main.js")
            to (io/file "../resources/public/paren-soup-compiler.js")]
        (.renameTo from to))
      fileset)))
