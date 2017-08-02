(set-env!
  :source-paths #{"src/clj" "src/cljs"}
  :resource-paths #{"resources"}
  :dependencies '[[org.clojure/test.check "0.9.0" :scope "test"]
                  [adzerk/boot-cljs "1.7.228-2" :scope "test"]
                  ; cljs deps
                  [org.clojure/clojurescript "1.9.473" :scope "test"]
                  [paren-soup "2.8.13" :scope "test"]
                  [mistakes-were-made "1.7.3" :scope "test"]
                  [cljsjs/codemirror "5.24.0-1" :scope "test"]
                  ; clj deps
                  [org.clojure/clojure "1.9.0-alpha17"]
                  [leiningen "2.7.1" :exclusions [leiningen.search]]
                  [ring "1.6.1"]
                  [play-cljs/lein-template "0.10.1-5"]
                  [eval-soup "1.2.2" :exclusions [org.clojure/core.async]]
                  [org.eclipse.jgit/org.eclipse.jgit "4.6.0.201612231935-r"]])

(require
  '[adzerk.boot-cljs :refer [cljs]]
  '[clojure.java.io :as io])

(task-options!
  sift {:include #{#"\.jar$"}}
  pom {:project 'nightcode
       :version "2.3.8-SNAPSHOT"}
  aot {:namespace '#{nightcode.core
                     nightcode.lein}}
  jar {:main 'nightcode.core
       :manifest {"Description" "An IDE for Clojure and ClojureScript"
                  "Url" "https://github.com/oakes/Nightcode"}
       :file "project.jar"})

(deftask run []
  (comp
    (aot)
    (with-pass-thru _
      (require
        '[clojure.spec.test.alpha :refer [instrument]]
        '[nightcode.core :refer [dev-main]])
      ((resolve 'instrument))
      ((resolve 'dev-main)))))

(deftask build []
  (comp (aot) (pom) (uber) (jar) (sift) (target)))

(deftask build-cljs []
  (comp
    (cljs :optimizations :advanced)
    (target)
    (with-pass-thru _
      (.renameTo (io/file "target/public/paren-soup.js") (io/file "resources/public/paren-soup.js"))
      (.renameTo (io/file "target/public/codemirror.js") (io/file "resources/public/codemirror.js")))))

