(set-env!
  :source-paths #{"src/clj" "src/cljs"}
  :resource-paths #{"resources"}
  :dependencies '[[adzerk/boot-cljs "1.7.228-2" :scope "test"]
                  [adzerk/boot-reload "0.4.12" :scope "test"]
                  ; project deps
                  [org.clojure/clojure "1.8.0"]
                  [org.clojure/clojurescript "1.9.854" :scope "test"]
                  [reagent "0.7.0" :scope "test"]
                  [ring "1.5.1"]])

(task-options!
  pom {:project '{{app-name}}
       :version "1.0.0-SNAPSHOT"
       :description "FIXME: write description"}
  aot {:namespace #{'{{namespace}}}}
  jar {:main '{{namespace}}})

(require
  '[adzerk.boot-cljs :refer [cljs]]
  '[adzerk.boot-reload :refer [reload]]
  '{{namespace}})

(deftask run []
  (comp
    (watch)
    (reload :asset-path "public")
    (cljs :source-map true :optimizations :none)
    (target)
    (with-pass-thru _
      ({{namespace}}/dev-main))))

(deftask build []
  (comp
    (cljs :optimizations :advanced)
    (aot)
    (pom)
    (uber)
    (jar)
    (target)))

