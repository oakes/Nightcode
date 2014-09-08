(ns leiningen.new.database-clojure
  (:require [leiningen.new.templates :as t]))

(defn database-clojure
  [name package-name]
  (let [render (t/renderer "database-clojure")
        console-render (t/renderer "console-clojure")
        package-name (t/sanitize (t/multi-segment (or package-name name)))
        main-ns (t/sanitize-ns package-name)
        data {:app-name name
              :name (t/project-name name)
              :namespace main-ns
              :path (t/name-to-path main-ns)
              :year (t/year)}]
    (t/->files data
               ["project.clj" (render "project.clj" data)]
               ["README.md" (render "README.md" data)]
               [".gitignore" (console-render "gitignore" data)]
               ["src/{{path}}.clj" (render "core.clj" data)]
               "resources")))
