(defproject {{name}} "0.1.0-SNAPSHOT"
  :description "FIXME: write this!"
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [ring "1.1.8"]]
  :plugins [[lein-cljsbuild "0.3.3"]
            [lein-ring "0.8.5"]]
  :hooks [leiningen.cljsbuild]
  :source-paths ["src/clj"]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :cljsbuild { 
    :builds {
      :main {
        :source-paths ["src/cljs"]
        :compiler {:output-to "resources/public/js/cljs.js"
                   :optimizations :simple
                   :pretty-print true}
        :jar true}}}
  :aot [{{name}}.server]
  :main {{name}}.server
  :ring {:handler {{name}}.server/app})

