(ns leiningen.new.console-java
  (:require [leiningen.new.templates :as t]))

(defn console-java
  [name package-name]
  (let [render (t/renderer "console-java")
        class-name "Core"
        main-ns (str package-name "." class-name)
        data {:raw-name name
              :name (t/project-name name)
              :package-name package-name
              :class-name class-name
              :namespace main-ns
              :nested-dirs (t/name-to-path main-ns)
              :year (t/year)}]
    (t/->files data
               ["project.clj" (render "project.clj" data)]
               ["README.md" (render "README.md" data)]
               [".gitignore" (render "gitignore" data)]
               ["src/{{nested-dirs}}.java" (render "Core.java" data)]
               "resources")))
