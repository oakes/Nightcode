(ns leiningen.new.mini2dx-java
  (:require [clojure.java.io :as io]
            [leiningen.new.templates :as t]))

(defn mini2dx-java
  [name package-name]
  (let [render (t/renderer "mini2dx-java")
        android-render (t/renderer "android-java")
        libgdx-render (t/renderer "libgdx-java")
        class-name "Core"
        desktop-class-name "DesktopLauncher"
        android-class-name "AndroidLauncher"
        main-ns (str package-name "." class-name)
        desktop-ns (str package-name "." desktop-class-name)
        android-ns (str package-name "." android-class-name)
        data {:raw-name name
              :name (t/project-name name)
              :package-name package-name
              :class-name class-name
              :desktop-class-name desktop-class-name
              :android-class-name android-class-name
              :namespace main-ns
              :desktop-namespace desktop-ns
              :android-namespace android-ns
              :nested-dirs (t/name-to-path main-ns)
              :desktop-dirs (t/name-to-path desktop-ns)
              :android-dirs (t/name-to-path android-ns)
              :year (t/year)}]
    (t/->files data
               ; main
               ["README.md" (render "README.md" data)]
               [".gitignore" (render "gitignore" data)]
               ; desktop
               ["desktop/project.clj" (render "desktop-project.clj" data)]
               ["desktop/src-common/{{nested-dirs}}.java"
                (render "Core.java" data)]
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
                (-> (io/resource "armeabi-libgdx.so") io/input-stream)]
               ["android/libs/armeabi-v7a/libgdx.so"
                (-> (io/resource "armeabi-v7a-libgdx.so") io/input-stream)])))
