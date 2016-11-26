(set-env!
  :source-paths #{"src/clj" "src/cljs"}
  :resource-paths #{"resources"}
  :dependencies '[[org.clojure/test.check "0.9.0" :scope "test"]
                  [adzerk/boot-cljs "1.7.228-1" :scope "test"]
                  ; cljs deps
                  [org.clojure/clojurescript "1.9.225" :scope "test"]
                  [paren-soup "2.6.11" :scope "test"]
                  [cljsjs/codemirror "5.19.0-0" :scope "test"]
                  ; clj deps
                  [org.clojure/clojure "1.9.0-alpha14"]
                  [leiningen "2.7.0" :exclusions [leiningen.search]]
                  [ring "1.4.0"]
                  [play-cljs/lein-template "0.6.6"]
                  [eval-soup "1.1.1" :exclusions [org.clojure/core.async]]])

(require '[adzerk.boot-cljs :refer [cljs]])

(task-options!
  sift {:include #{#"\.jar$"}}
  pom {:project 'nightcode
       :version "2.1.8-SNAPSHOT"}
  aot {:namespace '#{nightcode.core
                     nightcode.lein}}
  jar {:main 'nightcode.core
       :manifest {"Description" "An IDE for Clojure and ClojureScript"
                  "Url" "https://github.com/oakes/Nightcode"}})

(deftask run []
  (comp
    (aot)
    (with-pre-wrap fileset
      (require
        '[clojure.spec.test :refer [instrument]]
        '[nightcode.core :refer [dev-main]])
      ((resolve 'instrument))
      ((resolve 'dev-main))
      fileset)))

(deftask build []
  (comp (aot) (pom) (uber) (jar) (sift) (target)))

(deftask build-cljs []
  (comp (cljs :optimizations :advanced) (target)))

