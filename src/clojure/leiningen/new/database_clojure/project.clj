(defproject {{app-name}} "0.0.1-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[com.h2database/h2 "1.4.181"]
                 [org.clojure/clojure "1.6.0"]
                 [org.clojure/java.jdbc "0.3.5"]]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :aot [{{namespace}}]
  :main {{namespace}})
