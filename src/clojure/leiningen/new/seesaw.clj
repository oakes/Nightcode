(ns leiningen.new.seesaw
  (:use [leiningen.new.templates :only [renderer year project-name
                                        ->files sanitize-ns name-to-path
                                        multi-segment]]))

(defn seesaw
  "Creates a new Seesaw app"
  [name package-name]
  (let [render (renderer "seesaw")
        main-ns (multi-segment (sanitize-ns name))
        data {:name name
              :namespace main-ns
              :nested-dirs (name-to-path main-ns)
              :year (year)}]
    (println "Generating a lovely new Seesaw project named" (str name "..."))
    (->files data
             ["project.clj" (render "project.clj" data)]
             ["README.md" (render "README.md" data)]
             ["src/{{nested-dirs}}.clj" (render "core.clj" data)]
             ["test/{{nested-dirs}}_test.clj" (render "core_test.clj" data)])
    (println "Done!")
    (println "You can run " name " by typing 'lein run' in the project directory. Note: it may take a bit longer to start the application the first time you compile it.")))
