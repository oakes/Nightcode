(ns leiningen.new.quil-clojure
  (:require [leiningen.new.templates :as t]))

(defn quil-clojure
  [name package-name]
  (let [render (t/renderer "quil-clojure")
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
               ["LICENSE" (render "LICENSE" data)]
               [".gitignore" (render "gitignore" data)]
               ["src/{{path}}.clj" (render "core.clj" data)]
               ["test/{{path}}_test.clj" (render "test.clj" data)]
               ["doc/intro.md" (render "intro.md" data)]
               "resources")))
