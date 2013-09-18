(ns leiningen.new.libgdx-java
  (:require [clojure.java.io :as io]
            [leiningen.droid.new :as droid-new]
            [leiningen.new.templates :as t]))

(defn libgdx-java
  [name package-name]
  (let [render (t/renderer "libgdx-java")
        android-render (t/renderer "android-java")
        lein-droid-render (droid-new/renderer "templates")
        class-name "Core"
        desktop-class-name "DesktopLauncher"
        android-class-name "AndroidLauncher"
        main-ns (str package-name "." class-name)
        desktop-ns (str package-name "." desktop-class-name)
        android-ns (str package-name "." android-class-name)
        data {:app-name name
              :name (t/project-name name)
              :package package-name
              :package-sanitized package-name
              :class-name class-name
              :desktop-class-name desktop-class-name
              :android-class-name android-class-name
              :namespace main-ns
              :desktop-namespace desktop-ns
              :android-namespace android-ns
              :nested-dirs (t/name-to-path main-ns)
              :desktop-dirs (t/name-to-path desktop-ns)
              :android-dirs (t/name-to-path android-ns)
              :year (t/year)
              :target-sdk "15"}]
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
               ["android/src/{{android-dirs}}.java"
                (render "AndroidLauncher.java" data)]
               ["android/project.clj"
                (render "android-project.clj" data)]
               ["android/AndroidManifest.xml"
                (render "AndroidManifest.xml" data)]
               ["android/res/drawable-hdpi/ic_launcher.png"
                (lein-droid-render "ic_launcher_hdpi.png")]
               ["android/res/drawable-mdpi/ic_launcher.png"
                (lein-droid-render "ic_launcher_mdpi.png")]
               ["android/res/drawable-ldpi/ic_launcher.png"
                (lein-droid-render "ic_launcher_ldpi.png")]
               ["android/res/values/strings.xml"
                (lein-droid-render "strings.xml" data)]
               ["android/libs/armeabi/libgdx.so"
                (-> "armeabi-libgdx.so" io/resource io/input-stream)]
               ["android/libs/armeabi-v7a/libgdx.so"
                (-> "armeabi-v7a-libgdx.so" io/resource io/input-stream)])))
