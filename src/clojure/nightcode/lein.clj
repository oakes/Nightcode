(ns nightcode.lein
  (:require [clojure.java.io :as java.io]
            [clojure.main]
            [leiningen.core.eval]
            [leiningen.core.main]
            [leiningen.core.project]
            [leiningen.clean]
            [leiningen.cljsbuild]
            [leiningen.droid]
            [leiningen.javac]
            [leiningen.new]
            [leiningen.new.templates]
            [leiningen.trampoline]
            [leiningen.repl]
            [leiningen.run]
            [leiningen.test]
            [leiningen.uberjar]
            [nightcode.utils :as utils])
  (:import [com.hypirion.io ClosingPipe Pipe]
           [com.sun.jdi Bootstrap]
           [org.apache.bcel.classfile ClassParser])
  (:gen-class))

(def ^:const debug-port "7896")
(defonce class-name (str *ns*))

; utilities

(defn read-file
  [path]
  (let [length (.length (java.io/file path))]
    (let [data-barray (byte-array length)]
      (with-open [bis (java.io/input-stream path)]
        (.read bis data-barray))
      data-barray)))

(defn get-project-clj-path
  [path]
  (.getCanonicalPath (java.io/file path "project.clj")))

(defn read-project-clj
  [path]
  (when path
    (let [project-clj-path (get-project-clj-path path)]
      (if-not (.exists (java.io/file project-clj-path))
        (println (utils/get-string :no_project_clj))
        (try (leiningen.core.project/read project-clj-path)
          (catch Exception e {}))))))

(defn add-sdk-path
  [project-map]
  (assoc-in project-map
            [:android :sdk-path]
            (or (get-in project-map [:android :sdk-path])
                (utils/read-pref :android-sdk))))

(defn create-file-from-template
  [dir file-name template-namespace data]
  (let [render (leiningen.new.templates/renderer template-namespace)]
    (binding [leiningen.new.templates/*dir* dir]
      (->> [file-name (render file-name data)]
           (leiningen.new.templates/->files data)))))

(defn stale-java-classes
  [dirs compile-path]
  (for [dir dirs
        source (filter #(-> % (.getName) (.endsWith ".java"))
                       (file-seq (java.io/file dir)))
        :let [rel-source (.substring (.getPath source) (inc (count dir)))
              rel-compiled (.replaceFirst rel-source "\\.java$" ".class")
              compiled (java.io/file compile-path rel-compiled)]
        :when (>= (.lastModified source) (.lastModified compiled))]
    (.getPath compiled)))

(defn create-class-map
  [classes paths]
  (reduce (fn [class-map path]
            (if-let [parsed (try (.parse (ClassParser. path))
                              (catch Exception _))]
              (if-let [class-ref (-> #(= (.getClassName parsed) (.name %))
                                     (filter classes)
                                     first)]
                (doto class-map
                  (.put class-ref (read-file path)))
                class-map)
              class-map))
          (java.util.HashMap.)
          paths))

; check project types

(defn is-android-project?
  [path]
  (.exists (java.io/file path "AndroidManifest.xml")))

(defn is-java-project?
  [path]
  (when-let [project-map (read-project-clj path)]
    (or (:java-only project-map)
        (= (count (:source-paths project-map)) 0)
        (clojure.set/subset? (set (:source-paths project-map))
                             (set (:java-source-paths project-map))))))

(defn is-clojurescript-project?
  [path]
  (when-let [project-map (read-project-clj path)]
    (not (nil? (:cljsbuild project-map)))))

; start/stop thread/processes

(defn redirect-io
  [in out func]
  (binding [*out* out
            *err* out
            *in* in
            leiningen.core.main/*exit-process?* false]
    (func)))

(defn start-thread*
  [in out func]
  (->> (fn []
         (try (func)
           (catch Exception e (when-let [error (.getMessage e)]
                                (println error))))
         (println "\n===" (utils/get-string :finished) "==="))
       (redirect-io in out)
       (fn [])
       Thread.
       .start))

(defmacro start-thread
  [in out & body]
  `(start-thread* ~in ~out (fn [] ~@body)))

(defn start-process
  [process path & args]
  (reset! process (.exec (Runtime/getRuntime)
                         (into-array (flatten args))
                         nil
                         (java.io/file path)))
  (.addShutdownHook (Runtime/getRuntime)
                    (Thread. #(when @process (.destroy @process))))
  (with-open [out (java.io/reader (.getInputStream @process))
              err (java.io/reader (.getErrorStream @process))
              in (java.io/writer (.getOutputStream @process))]
    (let [pump-out (doto (Pipe. out *out*) .start)
          pump-err (doto (Pipe. err *err*) .start)
          pump-in (doto (ClosingPipe. *in* in) .start)]
      (.join pump-out)
      (.join pump-err)
      (.waitFor @process)
      (reset! process nil))))

(defn start-process-indirectly
  [process path & args]
  (let [project-map (read-project-clj path)
        java-cmd (or (:java-cmd project-map) (System/getenv "JAVA_CMD") "java")
        jar-file (-> (Class/forName class-name)
                     .getProtectionDomain
                     .getCodeSource
                     .getLocation
                     .toURI
                     java.io/file)]
    (start-process process
                   path
                   java-cmd
                   "-cp"
                   (if (.isDirectory jar-file)
                     (System/getProperty "java.class.path")
                     (.getCanonicalPath jar-file))
                   args)))

(defn start-process-directly
  [process path func]
  (let [project-map-orig (read-project-clj path)
        jvm-opts (conj (:jvm-opts project-map-orig)
                       (str "-agentlib:jdwp="
                            "transport=dt_socket,"
                            "server=y,"
                            "suspend=n,"
                            "address="
                            debug-port))
        project-map (-> project-map-orig
                        (assoc :eval-in :trampoline
                               :jvm-opts jvm-opts))
        forms leiningen.core.eval/trampoline-forms
        profiles leiningen.core.eval/trampoline-profiles]
    (reset! forms [])
    (reset! profiles [])
    (func path project-map)
    (doseq [i (range (count @forms))]
      (->> (leiningen.core.eval/shell-command project-map (nth @forms i))
           (start-process process path)))))

(defn stop-process
  [process]
  (when @process
    (.destroy @process)
    (reset! process nil)))

; low-level commands

(defn run-project-task
  [path project-map]
  (if (is-android-project? path)
    (doseq [sub-cmd ["build" "apk" "install" "run"]]
      (leiningen.droid/droid (add-sdk-path project-map) sub-cmd))
    (leiningen.run/run project-map)))

(defn run-repl-project-task
  [path project-map]
  (if (is-android-project? path)
    (doseq [sub-cmd ["doall" "repl"]]
      (leiningen.droid/droid (add-sdk-path project-map) sub-cmd)
      (Thread/sleep 10000))
    (leiningen.repl/repl project-map)))

(defn build-project-task
  [path project-map]
  (if (is-android-project? path)
    (-> (leiningen.droid/transform-into-release project-map)
        add-sdk-path
        leiningen.droid/execute-release-routine)
    (leiningen.uberjar/uberjar project-map)))

(defn test-project-task
  [path project-map]
  (leiningen.test/test project-map))

(defn clean-project-task
  [path project-map]
  (leiningen.clean/clean project-map))

(defn cljsbuild-project-task
  [path project-map]
  (leiningen.cljsbuild/cljsbuild project-map "auto"))

(defn hot-swap-project-task
  [path project-map]
  (when-let [conn (->> (Bootstrap/virtualMachineManager)
                       .attachingConnectors
                       (filter #(= (.name (.transport %)) "dt_socket"))
                       first)]
     (let [prm (.defaultArguments conn)
           stale-classes (-> (:java-source-paths project-map)
                             (stale-java-classes (:compile-path project-map))
                             doall)]
       (.setValue (.get prm "port") debug-port)
       (.setValue (.get prm "hostname") "127.0.0.1")
       (when-let [vm (try (.attach conn prm) (catch Exception _))]
         (leiningen.javac/javac project-map)
         (->> stale-classes
              (create-class-map (.allClasses vm))
              (.redefineClasses vm))
         (.dispose vm)))))

; high-level commands

(defn run-project
  [process in out path]
  (stop-process process)
  (->> (do (println (utils/get-string :running))
         (if (is-java-project? path)
           (start-process-directly process path run-project-task)
           (start-process-indirectly process path class-name "run")))
       (start-thread in out)))

(defn run-repl-project
  [process in out path]
  (stop-process process)
  (->> (do (println (utils/get-string :running_with_repl))
         (if (is-java-project? path)
           (start-process-directly process path run-repl-project-task)
           (start-process-indirectly process path class-name "repl")))
       (start-thread in out)))

(defn build-project
  [process in out path]
  (stop-process process)
  (->> (do (println (utils/get-string :building))
         (if (is-java-project? path)
           (start-process-directly process path build-project-task)
           (start-process-indirectly process path class-name "build")))
       (start-thread in out)))

(defn test-project
  [process in out path]
  (stop-process process)
  (->> (do (println (utils/get-string :testing))
         (if (is-java-project? path)
           (start-process-directly process path test-project-task)
           (start-process-indirectly process path class-name "test")))
       (start-thread in out)))

(defn clean-project
  [process in out path]
  (stop-process process)
  (->> (do (println (utils/get-string :cleaning))
         (if (is-java-project? path)
           (start-process-directly process path clean-project-task)
           (start-process-indirectly process path class-name "clean")))
       (start-thread in out)))

(defn cljsbuild-project
  [process in out path]
  (->> (start-process-indirectly process path class-name "cljsbuild")
       (start-thread in out)))

(defn new-project
  [in out parent-path project-type project-name package-name]
  (->> (try
         (if (= project-type :android)
           (leiningen.droid.new/new project-name package-name)
           (leiningen.new/new {} (name project-type) project-name package-name))
         (catch Exception e (println e)))
       (fn []
         (System/setProperty "leiningen.original.pwd" parent-path))
       (redirect-io in out)))

(defn run-repl
  [process in out]
  (stop-process process)
  (->> (start-process-indirectly process nil "clojure.main")
       (start-thread in out)))

(defn run-logcat
  [process in out path]
  (stop-process process)
  (->> (start-process process
                      nil
                      (-> (read-project-clj path)
                          add-sdk-path
                          :android
                          :sdk-path
                          (leiningen.droid.utils/sdk-binary :adb))
                      "logcat"
                      "*:I")
       (binding [leiningen.core.main/*exit-process?* false])
       (start-thread in out)))

(defn run-hot-swap
  [in out path]
  (->> (hot-swap-project-task path (read-project-clj path))
       (start-thread in out)))

; main function for "indirect" processes

(defn -main
  [cmd & args]
  (System/setProperty "jline.terminal" "dumb")
  (let [path "."
        project-map (-> (read-project-clj path)
                        leiningen.core.project/init-project)]
    (case cmd
      "run" (run-project-task path project-map)
      "repl" (run-repl-project-task path project-map)
      "build" (build-project-task path project-map)
      "test" (test-project-task path project-map)
      "clean" (clean-project-task path project-map)
      "cljsbuild" (cljsbuild-project-task path project-map)
      nil))
  (System/exit 0))
