(defproject nightrepl "0.0.1-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[nightcode "0.4.7"]
                 [org.clojure/clojure "1.7.0"]
                 [seesaw "1.4.5"]]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :aot [nightrepl.core]
  :main nightrepl.core)
