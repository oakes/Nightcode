(require
  '[cljs.build.api :as api]
  '[leiningen.core.project :as p :refer [defproject]]
  '[leiningen.clean :refer [clean]])

(defn read-project-clj []
  (p/ensure-dynamic-classloader)
  (-> "project.clj" load-file var-get))

(-> (read-project-clj)
    p/init-project
    clean)

(println "Building paren-soup.js")
(api/build "src" {:main          'nightcode.paren-soup
                  :optimizations :advanced
                  :output-to     "resources/public/paren-soup.js"
                  :output-dir    "target/public/paren-soup.out"})

