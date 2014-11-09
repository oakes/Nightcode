(defproject nightbuild "0.0.1-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[nightcode "0.4.2.5"]
                 [org.clojure/clojure "1.6.0"]
                 [seesaw "1.4.4"]]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :aot [nightbuild.core]
  :main nightbuild.core)
