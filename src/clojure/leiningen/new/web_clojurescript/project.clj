(defproject {{name}} "0.0.1-SNAPSHOT"
  :description "FIXME: write this!"
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [org.clojure/clojurescript "0.0-3308"]
                 [ring "1.3.2"]]
  :hooks [leiningen.cljsbuild]
  :source-paths ["src/clj"]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :cljsbuild { 
    :builds {
      :main {
        :source-paths ["src/cljs"]
        :compiler {:output-to "resources/public/cljs.js"
                   :optimizations :advanced
                   :pretty-print false}
        :jar true}}}
  :aot [{{namespace}}]
  :main {{namespace}}
  :ring {:handler {{namespace}}/app})
