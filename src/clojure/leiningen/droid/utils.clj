;; Provides utilities for the plugin.
;;
(ns leiningen.droid.utils
  (:require [leiningen.core.project :as pr])
  (:use [clojure.java.io :only (file reader)]
        [leiningen.core.main :only (info debug abort)]
        [leiningen.core.classpath :only [resolve-dependencies]]
        [clojure.string :only (join)])
  (:import java.io.File))

;; #### Convenient functions to run SDK binaries

(defmacro ensure-paths
  "Checks if the given directories or files exist. Aborts Leiningen
  execution in case either of them doesn't or the value equals nil.

  We assume paths to be strings or lists/vectors. The latter case is
  used exclusively for Windows batch-files which are represented like
  `cmd.exe /C batch-file`, so we test third element of the list for
  the existence."
  [& paths]
  `(do
     ~@(for [p paths]
         `(cond (nil? ~p)
                (abort "The value of" (str '~p) "is nil. Abort execution.")

                (or
                 (and (sequential? ~p) (not (.exists (file (nth ~p 2)))))
                 (and (string? ~p) (not (.exists (file ~p)))))
                (abort "The path" ~p "doesn't exist. Abort execution.")))))

(defn windows?
  "Returns true if we are running on Microsoft Windows"
  []
  (= java.io.File/separator "\\"))

(defn sdk-binary-paths
  "Returns a map of relative paths to different SDK binaries for both
  Unix and Windows platforms."
  [sdk-path build-tools-version]
  (ensure-paths sdk-path)
  (let [bt-root-dir (file sdk-path "build-tools")
        ;; build-tools directory contains a subdir which name we don't
        ;; know that has all the tools. Let's grab the first directory
        ;; inside build-tools/ and hope it is the one we need.
        bt-dir (or build-tools-version
                   (->> (.list bt-root-dir)
                        (filter #(.isDirectory (file bt-root-dir %)))
                        sort last))
        bt-ver (Integer/parseInt (get (re-find #"(\d+)\..*" bt-dir) 1 "-1"))]
    ;; if bt-ver is non-negative we have a definite numeric version number
    ;; assume the latest build-tools dir is not empty
    {:dx {:unix ["build-tools" bt-dir "dx"]
          :win ["build-tools" bt-dir "dx.bat"]}
     :adb {:unix ["platform-tools" "adb"]
           :win ["platform-tools" "adb.exe"]}
     :aapt {:unix ["build-tools" bt-dir "aapt"]
            :win ["build-tools" bt-dir "aapt.exe"]}
     :zipalign (if (>= bt-ver 20)
                 {:unix ["build-tools" bt-dir "zipalign"]
                  :win ["build-tools" bt-dir "zipalign.exe"]}
                 {:unix ["tools" "zipalign"]
                  :win ["tools" "zipalign.exe"]})
     :proguard {:unix ["tools" "proguard" "lib" "proguard.jar"]
                :win ["tools" "proguard" "lib" "proguard.jar"]}}))

(defn sdk-binary
  "Given the project map and the binary keyword, returns either a full
  path to the binary as a string, or a vector with call to cmd.exe for
  batch-files."
  [{{:keys [sdk-path build-tools-version]} :android} binary-kw]
  (let [binary (get-in (sdk-binary-paths sdk-path build-tools-version)
                       [binary-kw (if (windows?) :win :unix)])
        binary-str (str (apply file sdk-path binary))]
    (ensure-paths binary-str)
    (if (.endsWith (last binary) ".bat")
      ["cmd.exe" "/C" binary-str]
      binary-str)))

;; ### Middleware section

(defn absolutize
  "Taken from Leiningen source code.

  Absolutizes the `path` given `root` if it is relative. Leaves the
  path as is if it is absolute."
  [root path]
  (str (if (.isAbsolute (file path))
         path
         (file root path))))

(defn absolutize-android-paths
  "Taken from Leiningen source code.

  Absolutizes all values with keys ending with `path` or `paths` in
  the `:android` map of the project."
  [{:keys [root android] :as project}]
  (assoc project :android
         (into {} (for [[key val] android]
                    [key (cond (re-find #"-path$" (name key))
                               (absolutize root val)

                               (re-find #"-paths$" (name key))
                               (map (partial absolutize root) val)

                               :else val)]))))

(defn get-default-android-params
  "Returns a map of the default android-specific parameters."
  [{name :name, target-path :target-path}]
  {:out-dex-path (str target-path "/classes.dex")
   :manifest-path "AndroidManifest.xml"
   :res-path "res"
   :gen-path "gen"
   :out-res-path (str target-path "/res")
   :assets-path "assets"
   :out-res-pkg-path (str target-path "/" name ".ap_")
   :out-apk-path (str target-path "/" name ".apk")
   :keystore-path (str (file (System/getProperty "user.home")
                             ".android" "debug.keystore"))
   :key-alias "androiddebugkey"
   :repl-device-port 9999
   :repl-local-port 9999
   :target-version 10})

(declare android-parameters)

(defn read-project
  "Reads and initializes a Leiningen project and applies Android
  middleware to it."
  [project-file]
  (android-parameters (pr/init-project (pr/read (str project-file)))))

(defn get-project-file
  "Returns the path to project.clj file in the specified project
  directory (either absolute or relative)."
  [root project-directory-path]
  (let [project-directory (file project-directory-path)]
    (if (.isAbsolute project-directory)
      (file project-directory-path "project.clj")
      (file root project-directory-path "project.clj"))))

(defn process-project-dependencies
  "Parses `project.clj` files from the project dependencies to extract
  the paths to external resources and class files."
  [{{:keys [project-dependencies]} :android, root :root :as project}]
  (reduce (fn [project dependency-path]
            (let [project-file (get-project-file root dependency-path)]
              (if-not (.exists ^File project-file)
                (do
                  (info "WARNING:" (str project-file) "doesn't exist.")
                  project)
                (let [dep (read-project project-file)
                      {:keys [compile-path dependencies]} dep
                      {:keys [res-path out-res-path]} (:android dep)]
                  (-> project
                      (update-in [:dependencies]
                                 concat dependencies)
                      (update-in [:android :external-classes-paths]
                                 conj compile-path)
                      (update-in [:android :external-res-paths]
                                 conj res-path out-res-path))))))
          project project-dependencies))

;; This is the middleware function to be plugged into project.clj.
(defn android-parameters
  "Merges project's `:android` map with the default parameters map,
  processes project dependencies and absolutizes paths in the
  `:android` map."
  [{:keys [android] :as project}]
  (let [android-params (merge (get-default-android-params project)
                              android)]
    (-> project
        (assoc :android android-params)
        process-project-dependencies
        absolutize-android-paths)))

;; ### General utilities

(defn proj [] (read-project "sample/project.clj"))

(defn sdk-version-number
  "If version keyword is passed (for example, =:ics= or
  =:jelly-bean=), resolves it to the version number. Otherwise just
  returns the input."
  [kw-or-number]
  (if (keyword? kw-or-number)
    (case kw-or-number
      :froyo       8
      :gingerbread 10
      :honeycomb   13
      :ics         15
      :jelly-bean  17
      (abort "Unknown Android SDK version: " kw-or-number))
    kw-or-number))

(defn get-sdk-platform-path
  "Returns a version-specific path to the Android platform tools."
  [sdk-root version]
  (str (file sdk-root "platforms" (str "android-"
                                       (sdk-version-number version)))))

(defn get-sdk-android-jar
  "Returns a version-specific path to the `android.jar` SDK file."
  [sdk-root version]
  (str (file (get-sdk-platform-path sdk-root version) "android.jar")))

(defn get-sdk-google-api-path
  "Returns a version-specific path to the Google SDK directory."
  [sdk-root version]
  (str (file sdk-root "add-ons" (str "addon-google_apis-google-"
                                     (sdk-version-number version)))))

(defn get-sdk-google-api-jars
  "Returns a version-specific paths to all Google SDK jars."
  [sdk-root version]
  (map #(.getAbsolutePath ^File %)
       (rest ;; The first file is the directory itself, no need in it.
        (file-seq
         (file (str (get-sdk-google-api-path sdk-root version) "/libs"))))))

(defn- get-sdk-support-jar
  "Returns a path to the Android Support library."
  [sdk-root version]
  (.getAbsolutePath
   (apply file sdk-root "extras" "android" "support"
          (case version
            "v4"             ["v4" "android-support-v4.jar"]
            "v7-appcompat"   ["v7" "appcompat" "libs"
                              "android-support-v7-appcompat.jar"]
            "v7-gridlayout"  ["v7" "gridlayout" "libs"
                              "android-support-v7-gridlayout.jar"]
            "v7-mediarouter" ["v7" "mediarouter" "libs"
                              "android-support-v7-mediarouter.jar"]
            "v13"            ["v13" "android-support-v13.jar"]
            (abort "Unknown support library version in :support-libraries : "
                   version)))))

(defn get-sdk-support-jars
  "Takes a list of support library versions and returns a list of JAR
  files."
  [sdk-root version-list & [warn?]]
  (let [message "WARNING: Support library V4 is redundant if you use V13."
        versions (set version-list)
        versions (if (every? versions ["v4" "v13"])
                   (do (when warn? (info message))
                       (disj versions "v4"))
                   versions)]
    (map #(get-sdk-support-jar sdk-root %) (seq versions))))

(defn get-resource-jars
  "Get the list of dependency libraries that has `:use-resources true`
  in their definition."
  [{:keys [dependencies] :as project}]
  (let [res-deps (for [[lib _ & options :as dep] (:dependencies project)
                       :when (or (:use-resources (apply hash-map options))
                                 ;; Should be removed in final release
                                 (= lib 'org.clojure-android/clojure))]
                   dep)
        mod-proj (assoc project :dependencies res-deps)]
    (resolve-dependencies :dependencies mod-proj)))

(defmacro with-process
  "Executes the subprocess specified in the binding list and applies
  `body` do it while it is running. The binding list consists of a var
  name for the process and the list of strings that represents shell
  command.

  After body is executed waits for a subprocess to finish, then checks
  the exit code. If code is not zero then prints the subprocess'
  output. If in DEBUG mode print both the command and it's output even
  for the successful run."
  [[process-name command] & body]
  `(do
     (apply debug ~command)
     (let [builder# (ProcessBuilder. ~command)
           _# (.redirectErrorStream builder# true)
           ~process-name (.start builder#)
           output# (line-seq (reader (.getInputStream ~process-name)))]
       ~@body
       (.waitFor ~process-name)
       (doseq [line# output#]
         (if (= (.exitValue ~process-name) 0)
           (debug line#)
           (info line#)))
       (when-not (= (.exitValue ~process-name) 0)
         (abort "Abort execution."))
       output#)))

(defn sh
  "Executes the command given by `args` in a subprocess. Flattens the
  given list."
  [& args]
  (with-process [process (flatten args)]))

(defn dev-build?
  "Checks the build type of the current project, assuming dev build if
  not a release build"
  [project]
  (not= (get-in project [:android :build-type]) :release))

(defn wrong-usage
  "Returns a string with the information about the proper function usage."
  ([task-name function-var]
     (wrong-usage task-name function-var 0))
  ([task-name function-var arglist-number]
     (let [arglist (-> function-var
                       meta :arglists (nth arglist-number))
           argcount (count arglist)
           parametrify #(str "<" % ">")
           ;; Replace the destructuring construction after & with
           ;; [optional-args].
           arglist (if (= (nth arglist (- argcount 2)) '&)
                     (concat (map parametrify
                                  (take (- argcount 2) arglist))
                             ["[optional-args]"])
                     (map parametrify arglist))]
       (format "Wrong number of argumets. USAGE: %s %s"
               task-name (join (interpose " " arglist))))))

(defn prompt-user
  "Reads a string from the console until the newline character."
  [prompt]
  (print prompt)
  (flush)
  (read-line))

(defn read-password
  "Reads the password from the console without echoing the
  characters."
  [prompt]
  (if-let [console (System/console)]
    (join (.readPassword console prompt nil))
    (prompt-user prompt)))

(defn append-suffix
  "Appends a suffix to a filename, e.g. transforming `sample.apk` into
  `sample-signed.apk`"
  [filename suffix]
  (let [[_ without-ext ext] (re-find #"(.+)(\.\w+)" filename)]
    (str without-ext "-" suffix ext)))

(defn create-debug-keystore
  "Creates a keystore for signing debug APK files."
  [keystore-path]
  (sh "keytool" "-genkey" "-v"
      "-keystore" keystore-path
      "-alias" "androiddebugkey"
      "-sigalg" "SHA1withRSA"
      "-keyalg" "RSA"
      "-keysize" "1024"
      "-validity" "365"
      "-keypass" "android"
      "-storepass" "android"
      "-dname" "CN=Android Debug,O=Android,C=US"))

(defn relativize-path [^File dir ^File to-relativize]
  (.getPath (.relativize (.toURI dir)
                         (.toURI to-relativize))))
