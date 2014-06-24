(defproject nightpad "0.0.1-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[nightcode "0.3.7.1"
                  :exclusions [leiningen
                               lein-ancient
                               lein-cljsbuild
                               lein-clr
                               lein-droid
                               lein-fruit
                               lein-typed
                               play-clj/lein-template]]
                 [org.clojure/clojure "1.6.0"]
                 [seesaw "1.4.4"]]
  :uberjar-exclusions [#"clojure-clr.*\.zip"]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :aot [nightpad.core]
  :main nightpad.core)
