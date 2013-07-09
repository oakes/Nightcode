(ns leiningen.new.android-java
  "Generate a library project."
  (:use [leiningen.new.templates :only [renderer year project-name
                                        ->files sanitize name-to-path
                                        multi-segment]]))

(defn android-java
  "A general project template for libraries.

Accepts a group id in the project name: `lein new foo.bar/baz`"
  [name package-name]
  (let [render (renderer "android-java")
        class-name "MainActivity"
        main-ns (str package-name "." class-name)
        data {:raw-name name
              :name (project-name name)
              :package-name package-name
              :class-name class-name
              :namespace main-ns
              :nested-dirs (name-to-path main-ns)
              :year (year)}]
    (println "Generating a project called" name "based on the 'android-java' template.")
    (println "To see other templates (app, lein plugin, etc), try `lein help new`.")
    (->files data
             ["AndroidManifest.xml" (render "AndroidManifest.xml" data)]
             ["project.clj" (render "project.clj" data)]
             ["res/drawable-hdpi/ic_launcher.png" (render "ic_launcher_hdpi.png")]
             ["res/drawable-mdpi/ic_launcher.png" (render "ic_launcher_mdpi.png")]
             ["res/drawable-ldpi/ic_launcher.png" (render "ic_launcher_ldpi.png")]
             ["res/values/strings.xml" (render "strings.xml" data)]
             ["res/layout/main.xml" (render "main.xml" data)]
             ["README.md" (render "README.md" data)]
             [".gitignore" (render "gitignore" data)]
             ["src/{{nested-dirs}}.java" (render "MainActivity.java" data)]
             "libs")))
