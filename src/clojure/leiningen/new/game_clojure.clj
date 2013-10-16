(ns leiningen.new.game-clojure
  (:require [clojure.java.io :as io]
            [leiningen.droid.new :as droid-new]
            [leiningen.new.templates :as t]))

(defn game-clojure
  [name package-name]
  (let [render (t/renderer "game-clojure")
        android-render (t/renderer "android-java")
        java-render (t/renderer "game-java")
        lein-droid-render (droid-new/renderer "templates")
        desktop-class-name "desktop-launcher"
        android-class-name "AndroidLauncher"
        main-ns (t/multi-segment (t/sanitize-ns package-name))
        package-name (t/sanitize main-ns)
        desktop-ns (str main-ns "." desktop-class-name)
        android-ns (str main-ns "." android-class-name)
        data {:app-name name
              :name (t/project-name name)
              :package package-name
              :package-sanitized package-name
              :desktop-class-name desktop-class-name
              :android-class-name android-class-name
              :activity android-class-name
              :namespace main-ns
              :desktop-namespace desktop-ns
              :android-namespace android-ns
              :path (t/name-to-path main-ns)
              :desktop-path (t/name-to-path desktop-ns)
              :android-path (t/name-to-path android-ns)
              :year (t/year)
              :target-sdk "15"}]
    (t/->files data
               ; main
               ["README.md" (java-render "README.md" data)]
               [".gitignore" (java-render "gitignore" data)]
               ; desktop
               ["desktop/project.clj" (render "desktop-project.clj" data)]
               ["desktop/src-common/clojure/{{path}}.clj"
                (render "core.clj" data)]
               ["desktop/src/clojure/{{desktop-path}}.clj"
                (render "desktop-launcher.clj" data)]
               "desktop/src-common/java"
               "desktop/src/java"
               "desktop/resources"
               ; android
               ["android/src/java/{{android-path}}.java"
                (render "AndroidLauncher.java" data)]
               "android/src/clojure"
               ["android/project.clj"
                (render "android-project.clj" data)]
               ["android/AndroidManifest.xml"
                (lein-droid-render "AndroidManifest.xml" data)]
               ["android/res/drawable-hdpi/ic_launcher.png"
                (lein-droid-render "ic_launcher_hdpi.png")]
               ["android/res/drawable-mdpi/ic_launcher.png"
                (lein-droid-render "ic_launcher_mdpi.png")]
               ["android/res/drawable-ldpi/ic_launcher.png"
                (lein-droid-render "ic_launcher_ldpi.png")]
               ["android/res/values/strings.xml"
                (lein-droid-render "strings.xml" data)]
               ["android/res/drawable-hdpi/splash_circle.png"
                (lein-droid-render "splash_circle.png")]
               ["android/res/drawable-hdpi/splash_droid.png"
                (lein-droid-render "splash_droid.png")]
               ["android/res/drawable-hdpi/splash_hands.png"
                (lein-droid-render "splash_hands.png")]
               ["android/res/drawable/splash_background.xml"
                (lein-droid-render "splash_background.xml")]
               ["android/res/anim/splash_rotation.xml"
                (lein-droid-render "splash_rotation.xml")]
               ["android/res/layout/splashscreen.xml"
                (lein-droid-render "splashscreen.xml")]
               ["android/src/java/{{path}}/SplashActivity.java"
                (lein-droid-render "SplashActivity.java" data)]
               ["android/libs/armeabi/libgdx.so"
                (-> (io/resource "armeabi-libgdx.so") io/input-stream)]
               ["android/libs/armeabi-v7a/libgdx.so"
                (-> (io/resource "armeabi-v7a-libgdx.so") io/input-stream)])))
