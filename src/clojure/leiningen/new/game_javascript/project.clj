(defproject {{name}} "0.0.1-SNAPSHOT"
  :description "FIXME: write this!"
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [ring "1.3.2"]]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :aot [{{namespace}}]
  :main {{namespace}}
  :ring {:handler {{namespace}}/app})
