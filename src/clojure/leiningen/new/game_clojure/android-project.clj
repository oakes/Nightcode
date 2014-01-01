(defproject {{app-name}} "0.0.1-SNAPSHOT"
  :description "FIXME: write description"
  
  :dependencies [[com.badlogicgames.gdx/gdx "0.9.9" :use-resources true]
                 [com.badlogicgames.gdx/gdx-backend-android "0.9.9"]
                 [neko/neko "3.0.0"]
                 [org.clojure-android/clojure "1.5.1-jb" :use-resources true]
                 [play-clj "0.1.0-SNAPSHOT"]]
  :repositories [["sonatype"
                  "https://oss.sonatype.org/content/repositories/snapshots/"]]
  :profiles {:dev {:dependencies [[android/tools.nrepl "0.2.0-bigstack"]
                                  [compliment "0.0.3"]]
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
            
            ;; Uncomment this if dexer fails with OutOfMemoryException
            ;; :force-dex-optimize true
            
            :assets-path "../desktop/resources"
            :native-libraries-paths ["libs"]
            :target-version "{{target-sdk}}"
            :aot-exclude-ns ["clojure.parallel" "clojure.core.reducers"]
            :dex-opts ["-JXmx2048M"]}
  
  :source-paths ["src/clojure" "../desktop/src-common"]
  :java-source-paths ["src/java" "gen"]
  :javac-options ["-target" "1.7" "-source" "1.7" "-Xlint:-options"])
