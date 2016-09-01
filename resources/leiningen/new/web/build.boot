(set-env!
  :source-paths #{"src/clj" "src/cljs"}
  :resource-paths #{"resources"}
  :dependencies '[[adzerk/boot-cljs "1.7.228-1" :scope "test"]
                  [adzerk/boot-reload "0.4.12" :scope "test"]
                  [adzerk/boot-cljs-repl "0.3.2" :scope "test"]
                  ; for boot-cljs-repl
                  [com.cemerick/piggieback "0.2.1" :scope "test"]
                  [weasel "0.7.0" :scope "test"]
                  [org.clojure/tools.nrepl "0.2.12" :scope "test"]
                  ; project deps
                  [org.clojure/clojure "1.8.0"]
                  [org.clojure/clojurescript "1.9.227"]
                  [reagent "0.6.0-rc"]
                  [ring "1.4.0"]])

(task-options!
  pom {:project '{{app-name}}
       :version "1.0.0-SNAPSHOT"
       :description "FIXME: write description"}
  aot {:namespace #{'{{namespace}}}}
  jar {:main '{{namespace}}})

(require
  '[adzerk.boot-cljs :refer [cljs]]
  '[adzerk.boot-reload :refer [reload]]
  '[adzerk.boot-cljs-repl :refer [cljs-repl]]
  '{{namespace}})

(deftask run []
  (comp
    (watch)
    (reload :asset-path "public"
            :on-jsload '{{namespace}}/init)
    (cljs-repl)
    (cljs :source-map true :optimizations :none)
    (target)
    (with-pre-wrap fileset
      ({{namespace}}/-main)
      fileset)))

(deftask build []
  (comp
    (cljs :optimizations :advanced)
    (aot)
    (pom)
    (uber)
    (jar)
    (target)))

