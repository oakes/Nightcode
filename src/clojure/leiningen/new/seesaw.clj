(ns leiningen.new.seesaw
  (:use [leiningen.new.templates :only [renderer name-to-path year ->files]]))

(def render (renderer "seesaw"))

(defn seesaw
  "Creates a new Seesaw app"
  [name]
  (let [data {:name name
              :sanitized (name-to-path name)
	      :year (year)}]
    (println "Generating a lovely new Seesaw project named" (str name "..."))
    (->files data
             ["project.clj" (render "project.clj" data)]
	     ["README.md" (render "README.md" data)]
	     ["src/{{sanitized}}/core.clj" (render "core.clj" data)]
	     ["test/{{sanitized}}/core_test.clj" (render "core_test.clj" data)]
	     ["doc/intro.md" (render "intro.md" data)])
    (println "Done!")
    (println "You can run " name " by typing 'lein run' in the project directory. Note: it may take a bit longer to start the application the first time you compile it.")))
