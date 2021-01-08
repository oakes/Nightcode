(ns leiningen.new.game-javascript
  (:require [leiningen.new.templates :as t]))

(defn game-javascript
  [name package-name]
  (let [render (t/renderer "game-javascript")
        package-name (t/sanitize (t/multi-segment (or package-name name)))
        main-ns (t/sanitize-ns package-name)
        data {:name name
              :namespace main-ns
              :path (t/name-to-path main-ns)}]
    (t/->files data
               ["project.clj" (render "project.clj" data)]
               ["README.md" (render "README.md" data)]
               [".gitignore" (render "gitignore" data)]
               ["src/{{path}}.clj" (render "server.clj" data)]
               ["resources/public/index.html" (render "index.html")]
               ["resources/public/main.js" (render "main.js")]
               ["resources/public/phaser.min.js" (render "phaser.min.js")])))
