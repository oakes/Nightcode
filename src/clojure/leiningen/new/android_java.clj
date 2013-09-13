(ns leiningen.new.android-java
  (:require [leiningen.new.templates :as t]))

(defn android-java
  [name package-name]
  (let [render (t/renderer "android-java")
        class-name "MainActivity"
        main-ns (str (t/sanitize package-name) "." class-name)
        data {:raw-name name
              :name (t/project-name name)
              :package-name (t/sanitize package-name)
              :class-name class-name
              :namespace main-ns
              :nested-dirs (t/name-to-path main-ns)
              :year (t/year)}]
    (t/->files data
               ["AndroidManifest.xml" (render "AndroidManifest.xml" data)]
               ["project.clj" (render "project.clj" data)]
               ["res/drawable-hdpi/ic_launcher.png"
                (render "ic_launcher_hdpi.png")]
               ["res/drawable-mdpi/ic_launcher.png"
                (render "ic_launcher_mdpi.png")]
               ["res/drawable-ldpi/ic_launcher.png"
                (render "ic_launcher_ldpi.png")]
               ["res/values/strings.xml" (render "strings.xml" data)]
               ["res/layout/main.xml" (render "main.xml" data)]
               ["README.md" (render "README.md" data)]
               [".gitignore" (render "gitignore" data)]
               ["src/{{nested-dirs}}.java" (render "MainActivity.java" data)]
               "libs")))
