(defproject {{raw-name}} "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[com.badlogicgames.gdx/gdx "0.9.9-SNAPSHOT"]
                 [com.badlogicgames.gdx/gdx-backend-android "0.9.9-SNAPSHOT"]
                 [org.mini2Dx/mini2Dx-core "0.8"]
                 [org.mini2Dx/mini2Dx-tiled "0.8"]
                 [org.mini2Dx/mini2Dx-dependency-injection "0.8"]]
  :repositories [["sonatype" "https://oss.sonatype.org/content/repositories/snapshots/"]
                 ["mini2Dx-thirdparty"
                  "http://mini2dx.org/nexus/content/repositories/thirdparty"]
                 ["mini2Dx"
                  "http://mini2dx.org/nexus/content/repositories/releases"]]
  :java-source-paths ["src" "../common" "gen"]
  :java-only true
  :profiles {:dev {:android {:aot :all-with-unused}}
             :release {:android
                       {;; Specify the path to your private
                        ;; keystore and the the alias of the
                        ;; key you want to sign APKs with.
                        ;; :keystore-path "/home/user/.android/private.keystore"
                        ;; :key-alias "mykeyalias"
                        :aot :all}}}

  :android {;; Specify the path to the Android SDK directory either
            ;; here or in your ~/.lein/profiles.clj file.
            ;; :sdk-path "/home/user/path/to/android-sdk/"

            ;; Uncomment this if dexer fails with OutOfMemoryException
            ;; :force-dex-optimize true

            :native-libraries-paths ["libs"]
            :target-version "15"})
