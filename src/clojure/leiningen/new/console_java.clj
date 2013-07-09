(ns leiningen.new.console-java
  "Generate a library project."
  (:use [leiningen.new.templates :only [renderer year project-name
                                        ->files sanitize name-to-path
                                        multi-segment]]))

(defn console-java
  "A general project template for libraries.

Accepts a group id in the project name: `lein new foo.bar/baz`"
  [name package-name]
  (let [render (renderer "console-java")
        main-ns (str package-name ".Core")
        data {:raw-name name
              :name (project-name name)
              :package-name package-name
              :namespace main-ns
              :nested-dirs (name-to-path main-ns)
              :year (year)}]
    (println "Generating a project called" name "based on the 'console-java' template.")
    (println "To see other templates (app, lein plugin, etc), try `lein help new`.")
    (->files data
             ["project.clj" (render "project.clj" data)]
             ["README.md" (render "README.md" data)]
             ["doc/intro.md" (render "intro.md" data)]
             [".gitignore" (render "gitignore" data)]
             ["src/{{nested-dirs}}.java" (render "Core.java" data)]
             "resources")))
