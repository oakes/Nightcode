(ns leiningen.new.console-clojure
  (:require [leiningen.new.templates :as t]))

(defn console-clojure
  [name package-name]
  (let [render (t/renderer "console-clojure")
        main-ns (t/multi-segment (t/sanitize-ns package-name))
        data {:app-name name
              :name (t/project-name name)
              :namespace main-ns
              :path (t/name-to-path main-ns)
              :year (t/year)}]
    (t/->files data
               ["project.clj" (render "project.clj" data)]
               ["README.md" (render "README.md" data)]
               [".gitignore" (render "gitignore" data)]
               ["src/{{path}}.clj" (render "core.clj" data)]
               ["test/{{path}}_test.clj" (render "test.clj" data)]
               "resources")))
