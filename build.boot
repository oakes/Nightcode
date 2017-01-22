(set-env!
  :source-paths #{"src/clj" "src/cljs"}
  :resource-paths #{"resources"}
  :dependencies '[[org.clojure/test.check "0.9.0" :scope "test"]
                  [adzerk/boot-cljs "1.7.228-1" :scope "test"]
                  ; cljs deps
                  [org.clojure/clojurescript "1.9.293" :scope "test"]
                  [paren-soup "2.7.3" :scope "test"]
                  [cljsjs/codemirror "5.19.0-0" :scope "test"]
                  ; clj deps
                  [org.clojure/clojure "1.9.0-alpha14"]
                  [leiningen "2.7.0" :exclusions [leiningen.search]]
                  [ring "1.4.0"]
                  [play-cljs/lein-template "0.8.0.1"]
                  [eval-soup "1.2.0" :exclusions [org.clojure/core.async]]
                  [org.eclipse.jgit/org.eclipse.jgit "4.6.0.201612231935-r"]])

(require '[adzerk.boot-cljs :refer [cljs]])

(task-options!
  sift {:include #{#"\.jar$"}}
  pom {:project 'nightcode
       :version "2.2.1"}
  aot {:namespace '#{nightcode.core
                     nightcode.lein}}
  jar {:main 'nightcode.core
       :manifest {"Description" "An IDE for Clojure and ClojureScript"
                  "Url" "https://github.com/oakes/Nightcode"}
       :file "project.jar"})

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

