(defproject {{name}} "0.0.1-SNAPSHOT"
  :description "FIXME: write this!"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/clojurescript "1.7.228"]
                 [ring "1.4.0"]
                 [compojure "1.5.0"]
                 [hiccup "1.0.5"]]
  :source-paths ["src/clj"]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :plugins [[lein-cljsbuild "1.1.3"]]
  :hooks [leiningen.cljsbuild]
  :cljsbuild {:builds [{:source-paths ["src/cljs"]
                        :compiler {:output-to "resources/public/cljs.js"
                                   :optimizations :advanced
                                   :pretty-print false}
                        :jar true}]}
  :aot [{{namespace}}]
  :main {{namespace}}
  :ring {:handler {{namespace}}/app})
