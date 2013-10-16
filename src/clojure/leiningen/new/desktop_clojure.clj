(ns leiningen.new.desktop-clojure
  (:require [leiningen.new.templates :as t]))

(defn desktop-clojure
  "Creates a new Seesaw app"
  [name package-name]
  (let [render (t/renderer "desktop-clojure")
        main-ns (t/multi-segment (t/sanitize-ns package-name))
        data {:name name
              :namespace main-ns
              :path (t/name-to-path main-ns)
              :year (t/year)}]
    (t/->files data
               ["project.clj" (render "project.clj" data)]
               ["README.md" (render "README.md" data)]
               ["src/{{path}}.clj" (render "core.clj" data)]
               ["test/{{path}}_test.clj"
                (render "core_test.clj" data)])))
