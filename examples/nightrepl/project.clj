(defproject nightrepl "0.0.1-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[nightcode "LATEST"]
                 [org.clojure/clojure "1.5.1"]
                 [seesaw "1.4.4"]]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :aot [nightrepl.core]
  :main nightrepl.core)
