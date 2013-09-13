(ns leiningen.new.console
  (:require [leiningen.new.templates :as t]))

(defn console
  [name package-name]
  (let [render (t/renderer "console")
        main-ns (t/multi-segment (t/sanitize-ns name))
        data {:raw-name name
              :name (t/project-name name)
              :namespace main-ns
              :nested-dirs (t/name-to-path main-ns)
              :year (t/year)}]
    (t/->files data
               ["project.clj" (render "project.clj" data)]
               ["README.md" (render "README.md" data)]
               [".gitignore" (render "gitignore" data)]
               ["src/{{nested-dirs}}.clj" (render "core.clj" data)]
               ["test/{{nested-dirs}}_test.clj" (render "test.clj" data)]
               "resources")))
