(set-env!
  :source-paths #{"src"}
  :resource-paths #{"resources"}
  :dependencies '[[org.clojure/test.check "0.9.0" :scope "test"]
                  ; project deps
                  [org.clojure/clojure "1.9.0-alpha7"]
                  [boot/core "2.6.0"]
                  [boot/base "2.6.0"]
                  [boot/aether "2.6.0"]
                  [boot/worker "2.6.0"]
                  [boot/pod "2.6.0"]
                  [adzerk/boot-test "1.1.1"]
                  [seancorfield/boot-new "0.4.4"]
                  [stencil "0.5.0" :exclusions [org.clojure/clojure]] ; for boot-new
                  [leiningen "2.6.1" :exclusions [leiningen.search]]
                  [ring "1.4.0"]
                  [clojail "1.0.6"]])

(task-options!
  pom {:project 'nightcode
       :version "2.0.0-SNAPSHOT"}
  aot {:namespace '#{net.sekao.nightcode.core
                     net.sekao.nightcode.controller
                     net.sekao.nightcode.process}}
  jar {:main 'net.sekao.nightcode.core
       :manifest {"Description" "An IDE for Clojure and ClojureScript"
                  "Url" "https://github.com/oakes/Nightcode"}})

(deftask run []
  (comp
    (aot)
    (with-pre-wrap fileset
      (require '[net.sekao.nightcode.core :refer [dev-main]])
      ((resolve 'dev-main))
      fileset)))

(deftask run-repl []
  (comp
    (aot)
    (repl :init-ns 'net.sekao.nightcode.core)))

(deftask build []
  (comp (aot) (pom) (uber) (jar) (target)))
