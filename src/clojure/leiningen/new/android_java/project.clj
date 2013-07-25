(defproject {{raw-name}} "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :java-source-paths ["src" "gen"]
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

            ;; Specify this if your project is a library.
            ;; :library false

            ;; Uncomment this if dexer fails with OutOfMemoryException.
            ;; :force-dex-optimize true

            ;; Options to pass to dx executable, former is for general
            ;; java-related options and later is for 'dex task'-specific options.
            ;; :dex-opts ["-JXmx4096M"]
            ;; :dex-aux-opts ["--num-threads=2"]

            ;; Proguard config for "droid create-obfuscated-dex" task.
            ;; :proguard-conf-path "proguard.cfg"
            ;; :proguard-opts ["-printseeds"]

            ;; Uncomment this line to be able to use Google API.
            ;; :use-google-api true

            ;; Use this property to add project dependencies.
            ;; :project-dependencies [ "/path/to/library/project" ]

            ;; Sequence of external jars or class folders to include
            ;; into project, e.g. android-support-v4.jar
            ;; :external-classes-paths ["<sdk-home>/extras/android/support/v4/android-support-v4.jar"
            ;;                          "path/to/classfiles/"]

            ;; sequence of paths where native libraries may be found for packaging
            ;; :native-libraries-paths ["libs"]

            ;; Minimum supported version could be specified as well,
            ;; its meaning is similar to that in AndroidManifest.xml.
            ;; :min-version "10"

            ;; Sequence of namespaces that should not be compiled.
            ;:aot-exclude-ns ["clojure.parallel" "clojure.core.reducers"]

            ;; Target version affects api used for compilation.
            :target-version "15"})
