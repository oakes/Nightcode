(defproject {{raw-name}} "0.1.0-SNAPSHOT"
  :description "FIXME: write description"

  :java-source-paths ["src" "gen"]

  ;; The following two definitions are optional. The default
  ;; target-path is "target", but you can change it to whatever you like.
  ;; :target-path "bin"
  ;; :compile-path "bin/classes"

  :java-only true

  ;; :dependencies []
  :profiles {:dev {;; :dependencies []
                   :android {:aot :all-with-unused}}
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

            ;; Uncomment this if dexer fails with OutOfMemoryException.
            ;; :force-dex-optimize true

            ;; Target version affects api used for compilation.
            :target-version "15"})
