(set-env!
  :source-paths #{"src/clj"}
  :resource-paths #{"resources"}
  :dependencies '[[org.clojure/test.check "0.9.0" :scope "test"]
                  ; project deps
                  [org.clojure/clojure "1.9.0-alpha13"]
                  [leiningen "2.7.0" :exclusions [leiningen.search]]
                  [ring "1.4.0"]
                  [play-cljs/lein-template "0.6.4"]
                  [eval-soup "1.0.0"]])

(task-options!
  sift {:include #{#"\.jar$"}}
  pom {:project 'nightcode
       :version "2.1.5-SNAPSHOT"}
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

