(defproject {{raw-name}} "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[com.badlogic.gdx/gdx "0.9.9-SNAPSHOT"]
                 [com.badlogic.gdx/gdx-backend-android "0.9.9-SNAPSHOT"]]
  :repositories [["libgdx" "http://libgdx.badlogicgames.com/nightlies/maven/"]]
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
