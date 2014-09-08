(ns leiningen.new.console-java
  (:require [leiningen.new.templates :as t]))

(defn console-java
  [name package-name]
  (let [render (t/renderer "console-java")
        console-render (t/renderer "console-clojure")
        class-name "Main"
        package-name (t/sanitize (t/multi-segment (or package-name name)))
        main-ns (str package-name "." class-name)
        data {:app-name name
              :name (t/project-name name)
              :package package-name
              :class-name class-name
              :namespace main-ns
              :path (t/name-to-path main-ns)
              :year (t/year)}]
    (t/->files data
               ["project.clj" (render "project.clj" data)]
               ["README.md" (render "README.md" data)]
               [".gitignore" (console-render "gitignore" data)]
               ["src/{{path}}.java" (render "Main.java" data)]
               "resources")))
