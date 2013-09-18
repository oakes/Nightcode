(ns leiningen.new.android-java
  (:require [leiningen.droid.new :as droid-new]
            [leiningen.new.templates :as t]))

(defn android-java
  [name package-name]
  (let [render (t/renderer "android-java")
        class-name "MainActivity"
        main-ns (str (t/sanitize package-name) "." class-name)
        lein-droid-render (droid-new/renderer "templates")
        data {:app-name name
              :name (t/project-name name)
              :package (t/sanitize package-name)
              :android-class-name class-name
              :activity class-name
              :namespace main-ns
              :nested-dirs (t/name-to-path main-ns)
              :year (t/year)
              :target-sdk "15"}]
    (t/->files data
               ["project.clj" (render "project.clj" data)]
               ["res/layout/main.xml" (render "main.xml" data)]
               ["README.md" (render "README.md" data)]
               [".gitignore" (render "gitignore" data)]
               ["src/{{nested-dirs}}.java" (render "MainActivity.java" data)]
               ["AndroidManifest.xml" (render "AndroidManifest.xml" data)]
               ["res/drawable-hdpi/ic_launcher.png"
                (lein-droid-render "ic_launcher_hdpi.png")]
               ["res/drawable-mdpi/ic_launcher.png"
                (lein-droid-render "ic_launcher_mdpi.png")]
               ["res/drawable-ldpi/ic_launcher.png"
                (lein-droid-render "ic_launcher_ldpi.png")]
               ["res/values/strings.xml"
                (lein-droid-render "strings.xml" data)]
               "libs")))
