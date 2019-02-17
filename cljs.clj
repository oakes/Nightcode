(require
  '[cljs.build.api :as api]
  '[leiningen.core.project :as p :refer [defproject]]
  '[leiningen.clean :refer [clean]])

(defn read-project-clj []
  (p/ensure-dynamic-classloader)
  (-> "project.clj" load-file var-get))

(def project (p/init-project (read-project-clj)))

(clean project)
(println "Building paren-soup.js")
(api/build "src" {:main          'nightcode.paren-soup
                  :optimizations :advanced
                  :output-to     "resources/public/paren-soup.js"
                  :output-dir    "target/public/paren-soup.out"})

(clean project)
(println "Building codemirror.js")
(api/build "src" {:main          'nightcode.codemirror
                  :optimizations :advanced
                  :output-to     "resources/public/codemirror.js"
                  :output-dir    "target/public/codemirror.out"})
