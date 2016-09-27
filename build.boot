(set-env!
  :source-paths #{"src"}
  :resource-paths #{"resources"}
  :dependencies '[[org.clojure/test.check "0.9.0" :scope "test"]
                  ; project deps
                  [org.clojure/clojure "1.9.0-alpha13"]
                  [leiningen "2.7.0" :exclusions [leiningen.search]]
                  [ring "1.4.0"]
                  [clojail "1.0.6"]
                  [play-cljs/lein-template "0.6.4"]])

(task-options!
  sift {:include #{#"\.jar$"}}
  pom {:project 'nightcode
       :version "2.1.5-SNAPSHOT"}
  aot {:namespace '#{net.sekao.nightcode.core
                     net.sekao.nightcode.lein}}
  jar {:main 'net.sekao.nightcode.core
       :manifest {"Description" "An IDE for Clojure and ClojureScript"
                  "Url" "https://github.com/oakes/Nightcode"}})

(deftask run []
  (comp
    (aot)
    (with-pre-wrap fileset
      (require
        '[clojure.spec.test :refer [instrument]]
        '[net.sekao.nightcode.core :refer [dev-main]])
      ((resolve 'instrument))
      ((resolve 'dev-main))
      fileset)))

(deftask build []
  (comp (aot) (pom) (uber) (jar) (sift) (target)))

