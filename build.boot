(set-env!
  :source-paths #{"src" "src-java"}
  :resource-paths #{"resources"}
  :dependencies '[[org.clojure/test.check "0.9.0" :scope "test"]
                  ; project deps
                  [org.clojure/clojure "1.9.0-alpha10"]
                  [leiningen "2.6.1" :exclusions [leiningen.search]]
                  [ring "1.4.0"]
                  [clojail "1.0.6"]
                  [kezban "0.1.2-SNAPSHOT"]])

(task-options!
  sift {:include #{#"\.jar$"}}
  pom {:project 'nightcode
       :version "2.0.3"}
  aot {:namespace '#{net.sekao.nightcode.core
                     net.sekao.nightcode.lein}}
  jar {:main 'net.sekao.nightcode.core
       :manifest {"Description" "An IDE for Clojure and ClojureScript"
                  "Url" "https://github.com/oakes/Nightcode"}})

(deftask run []
  (comp
    (javac)
    (aot)
    (with-pre-wrap fileset
      (require '[net.sekao.nightcode.core :refer [dev-main]])
      ((resolve 'dev-main))
      fileset)))

(deftask run-repl []
  (comp
    (javac)
    (aot)
    (repl :init-ns 'net.sekao.nightcode.core)))

(deftask build []
  (comp (javac) (aot) (pom) (uber) (jar) (sift) (target)))
