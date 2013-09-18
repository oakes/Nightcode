(ns leiningen.new.console-java
  (:require [leiningen.new.templates :as t]))

(defn console-java
  [name package-name]
  (let [render (t/renderer "console-java")
        class-name "Core"
        main-ns (str package-name "." class-name)
        data {:app-name name
              :name (t/project-name name)
              :package package-name
              :path (t/name-to-path package-name)
              :class-name class-name
              :namespace main-ns
              :year (t/year)}]
    (t/->files data
               ["project.clj" (render "project.clj" data)]
               ["README.md" (render "README.md" data)]
               [".gitignore" (render "gitignore" data)]
               ["src/{{path}}/Core.java" (render "Core.java" data)]
               "resources")))
