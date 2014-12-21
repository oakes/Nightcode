(defproject {{name}} "0.0.1-SNAPSHOT"
  :description "FIXME: write this!"
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-2505"]
                 [ring "1.3.2"]]
  :plugins [[lein-cljsbuild "1.0.3"]
            [lein-ring "0.8.13"]]
  :hooks [leiningen.cljsbuild]
  :source-paths ["src/clj"]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :cljsbuild { 
    :builds {
      :main {
        :source-paths ["src/cljs"]
        :compiler {:output-to "resources/public/cljs.js"
                   :optimizations :simple
                   :pretty-print true}
        :jar true}}}
  :aot [{{namespace}}]
  :main {{namespace}}
  :ring {:handler {{namespace}}/app})
