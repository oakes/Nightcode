(ns leiningen.new.dotnet-clojure
  (:require [clojure.java.io :as io]
            [leiningen.new.templates :as t]))

(defn dotnet-clojure
  [name package-name]
  (let [render (t/renderer "dotnet-clojure")
        package-name (t/sanitize (t/multi-segment (or package-name name)))
        main-ns (t/sanitize-ns package-name)
        zip-path "clojure-clr-1.5.0-Release-4.0.zip"
        internal-dir "Release"
        data {:app-name name
              :name (t/project-name name)
              :namespace main-ns
              :path (t/name-to-path main-ns)
              :year (t/year)
              :zip-path zip-path
              :internal-dir internal-dir}]
    (t/->files data
               ["project.clj" (render "project.clj" data)]
               ["README.md" (render "README.md" data)]
               [".gitignore" (render "gitignore" data)]
               ["src/{{path}}.clj" (render "core.clj" data)]
               "resources"
               ["{{zip-path}}" (-> (io/resource zip-path) io/input-stream)])))
