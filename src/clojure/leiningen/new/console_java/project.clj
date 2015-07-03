(defproject {{app-name}} "0.0.1-SNAPSHOT"
  :description "FIXME: write description"
  :profiles {:dev {:dependencies [[org.clojure/clojure "1.7.0"]]}}
  :java-source-paths ["src"]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :aot :all
  :main {{namespace}})
