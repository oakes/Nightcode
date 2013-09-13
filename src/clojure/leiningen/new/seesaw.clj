(ns leiningen.new.seesaw
  (:require [leiningen.new.templates :as t]))

(defn seesaw
  "Creates a new Seesaw app"
  [name package-name]
  (let [render (t/renderer "seesaw")
        main-ns (t/multi-segment (t/sanitize-ns name))
        data {:name name
              :namespace main-ns
              :nested-dirs (t/name-to-path main-ns)
              :year (t/year)}]
    (t/->files data
               ["project.clj" (render "project.clj" data)]
               ["README.md" (render "README.md" data)]
               ["src/{{nested-dirs}}.clj" (render "core.clj" data)]
               ["test/{{nested-dirs}}_test.clj"
                (render "core_test.clj" data)])))
