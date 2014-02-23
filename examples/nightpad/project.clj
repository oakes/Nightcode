(defproject nightpad "0.0.1-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[nightcode "LATEST"
                  :exclusions [leiningen
                               lein-ancient
                               lein-cljsbuild
                               lein-droid
                               lein-fruit
                               play-clj/lein-template]]
                 [org.clojure/clojure "1.5.1"]
                 [seesaw "1.4.4"]]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :aot [nightpad.core]
  :main nightpad.core)
