(ns leiningen.new.web
  (:require [leiningen.new.templates :as t]))

(defn web
  [name package-name]
  (let [render (t/renderer "web")
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
      ["src/clj/{{path}}.clj" (render "core.clj" data)]
      ["src/cljs/{{path}}.cljs" (render "core.cljs" data)]
      ["resources/public/index.html" (render "index.html" data)]
      ["resources/public/main.cljs.edn" (render "main.cljs.edn.txt" data)])))

