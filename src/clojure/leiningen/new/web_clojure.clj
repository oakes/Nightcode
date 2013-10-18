(ns leiningen.new.web-clojure
  (:require [leiningen.new.templates :as t]))

(defn web-clojure
  [name package-name]
  (let [render (t/renderer "web-clojure")
        package-name (t/sanitize (t/multi-segment (or package-name name)))
        main-ns (t/sanitize-ns package-name)
        data {:name name
              :namespace main-ns
              :path (t/name-to-path main-ns)}]
    (t/->files data
               ["project.clj" (render "project.clj" data)]
               ["README.md" (render "README.md" data)]
               ["src/clj/{{path}}.clj" (render "server.clj" data)]
               ["src/cljs/{{path}}.cljs" (render "client.cljs" data)]
               ["resources/public/css/page.css" (render "page.css" data)]
               ["resources/public/help.html" (render "help.html" data)])))
