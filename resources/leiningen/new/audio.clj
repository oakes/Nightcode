(ns leiningen.new.audio
  (:require [leiningen.new.templates :as t]))

(defn audio
  [name package-name]
  (let [render (t/renderer "audio")
        package-name (t/sanitize (t/multi-segment (or package-name name)))
        main-ns (t/sanitize-ns package-name)
        data {:app-name name
              :name (t/project-name name)
              :namespace main-ns
              :path (t/name-to-path main-ns)}]
    (t/->files data
      ["boot.properties" (render "boot.properties" data)]
      ["build.boot" (render "build.boot" data)]
      ["README.md" (render "README.md" data)]
      [".gitignore" (render "gitignore" data)]
      ["src/{{path}}.clj" (render "core.clj" data)]
      "resources")))

