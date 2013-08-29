(ns leiningen.new.mini2dx-java
  "Generate a library project."
  (:use [leiningen.new.templates :only [renderer year project-name
                                        ->files sanitize name-to-path
                                        multi-segment]])
  (:require [clojure.java.io :as java.io]))

(defn mini2dx-java
  "A general project template for libraries.

Accepts a group id in the project name: `lein new foo.bar/baz`"
  [name package-name]
  (let [render (renderer "mini2dx-java")
        android-render (renderer "android-java")
        libgdx-render (renderer "libgdx-java")
        class-name "Core"
        desktop-class-name "DesktopLauncher"
        android-class-name "AndroidLauncher"
        main-ns (str package-name "." class-name)
        desktop-ns (str package-name "." desktop-class-name)
        android-ns (str package-name "." android-class-name)
        data {:raw-name name
              :name (project-name name)
              :package-name package-name
              :class-name class-name
              :desktop-class-name desktop-class-name
              :android-class-name android-class-name
              :namespace main-ns
              :desktop-namespace desktop-ns
              :android-namespace android-ns
              :nested-dirs (name-to-path main-ns)
              :desktop-dirs (name-to-path desktop-ns)
              :android-dirs (name-to-path android-ns)
              :year (year)}]
    (println "Generating a project called" name "based on the 'mini2dx-java' template.")
    (println "To see other templates (app, lein plugin, etc), try `lein help new`.")
    (->files data
             ; main
             ["README.md" (render "README.md" data)]
             [".gitignore" (render "gitignore" data)]
             ; desktop
             ["desktop/project.clj" (render "desktop-project.clj" data)]
             ["desktop/src-common/{{nested-dirs}}.java" (render "Core.java" data)]
             ["desktop/src/{{desktop-dirs}}.java"
              (render "DesktopLauncher.java" data)]
             ; android
             ["android/AndroidManifest.xml"
              (libgdx-render "AndroidManifest.xml" data)]
             ["android/project.clj" (render "android-project.clj" data)]
             ["android/res/drawable-hdpi/ic_launcher.png"
              (android-render "ic_launcher_hdpi.png")]
             ["android/res/drawable-mdpi/ic_launcher.png"
              (android-render "ic_launcher_mdpi.png")]
             ["android/res/drawable-ldpi/ic_launcher.png"
              (android-render "ic_launcher_ldpi.png")]
             ["android/res/values/strings.xml"
              (android-render "strings.xml" data)]
             ["android/res/layout/main.xml"
              (android-render "main.xml" data)]
             ["android/src/{{android-dirs}}.java"
              (render "AndroidLauncher.java" data)]
             ["android/libs/armeabi/libgdx.so"
              (-> (java.io/resource "armeabi-libgdx.so")
                  java.io/input-stream)]
             ["android/libs/armeabi-v7a/libgdx.so"
              (-> (java.io/resource "armeabi-v7a-libgdx.so")
                  java.io/input-stream)])))
