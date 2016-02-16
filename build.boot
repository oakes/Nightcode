(set-env!
  :source-paths #{"src"}
  :resource-paths #{"resources"}
  :dependencies '[[org.clojure/clojure "1.8.0"]
                  [prismatic/schema "0.4.3"]])

(task-options!
  pom {:project 'nightcode
       :version "2.0.0-SNAPSHOT"}
  aot {:namespace '#{net.sekao.nightcode.core}}
  jar {:main 'net.sekao.nightcode.core
       :manifest {"Description" "An IDE for Clojure and ClojureScript"
                  "Url" "https://github.com/oakes/Nightcode"}})

(deftask run []
  (comp
    (aot)
    (with-pre-wrap fileset
      (require '[net.sekao.nightcode.core :refer [main]])
      ((resolve 'main))
      fileset)))

(deftask build []
  (comp (aot) (pom) (uber) (jar)))
