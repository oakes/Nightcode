(set-env!
  :source-paths #{"src/clj" "src/cljs"}
  :resource-paths #{"resources"}
  :dependencies '[[org.clojure/test.check "0.9.0" :scope "test"]
                  [adzerk/boot-cljs "2.1.4" :scope "test"]
                  ; cljs deps
                  [org.clojure/clojurescript "1.9.946" :scope "test" :exclusions [org.clojure/tools.reader]]
                  [org.clojure/tools.reader "1.1.0" :scope "test"]
                  [paren-soup "2.9.0" :scope "test"]
                  [mistakes-were-made "1.7.3" :scope "test"]
                  [cljsjs/codemirror "5.24.0-1" :scope "test"]
                  ; clj deps
                  [org.clojure/clojure "1.9.0-beta2"]
                  [leiningen "2.7.1" :exclusions [leiningen.search]]
                  [ring "1.6.1"]
                  [play-cljs/lein-template "0.10.1-5"]
                  [eval-soup "1.2.3" :exclusions [org.clojure/core.async]]
                  [org.eclipse.jgit/org.eclipse.jgit "4.6.0.201612231935-r"]])

(require
  '[adzerk.boot-cljs :refer [cljs]]
  '[clojure.java.io :as io])

(task-options!
  sift {:include #{#"\.jar$"}}
  pom {:project 'nightcode
       :version "2.4.0"}
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

(def jar-exclusions
  ;; the standard exclusions don't work on windows,
  ;; because we need to use backslashes
  (conj boot.pod/standard-jar-exclusions
    #"(?i)^META-INF\\[^\\]*\.(MF|SF|RSA|DSA)$"
    #"(?i)^META-INF\\INDEX.LIST$"))

(deftask build []
  (comp (aot) (pom) (uber :exclude jar-exclusions) (jar) (sift) (target)))

(deftask build-cljs []
  (comp
    (cljs :optimizations :advanced)
    (target)
    (with-pass-thru _
      (.renameTo (io/file "target/public/paren-soup.js") (io/file "resources/public/paren-soup.js"))
      (.renameTo (io/file "target/public/codemirror.js") (io/file "resources/public/codemirror.js")))))

