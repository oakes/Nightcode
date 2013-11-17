(ns nightcode.lein
  (:require [clojure.java.io :as io]
            [clojure.main]
            [leiningen.core.eval]
            [leiningen.core.main]
            [leiningen.core.project]
            [leiningen.clean]
            [leiningen.cljsbuild]
            [leiningen.droid]
            [leiningen.fruit]
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
  (let [length (.length (io/file path))]
    (let [data-barray (byte-array length)]
      (with-open [bis (io/input-stream path)]
        (.read bis data-barray))
      data-barray)))

(defn get-project-clj-path
  [path]
  (.getCanonicalPath (io/file path "project.clj")))

(defn add-sdk-path
  [project]
  (assoc-in project
            [:android :sdk-path]
            (or (get-in project [:android :sdk-path])
                (utils/read-pref :android-sdk))))

(defn add-robovm-path
  [project]
  (assoc-in project
            [:ios :robovm-path]
            (or (get-in project [:ios :robovm-path])
                (utils/read-pref :robovm))))

(defn read-project-clj
  [path]
  (when path
    (let [project-clj-path (get-project-clj-path path)]
      (if-not (.exists (io/file project-clj-path))
        (println (utils/get-string :no_project_clj))
        (-> (leiningen.core.project/read project-clj-path)
            add-sdk-path
            add-robovm-path
            (try (catch Exception e {})))))))

(defn read-android-project
  [project]
  (leiningen.droid.classpath/init-hooks)
  (some-> project
          (leiningen.core.project/unmerge-profiles [:base])
          leiningen.droid.utils/android-parameters
          add-sdk-path))

(defn create-file-from-template
  [dir file-name template-namespace data]
  (let [render (leiningen.new.templates/renderer template-namespace)]
    (binding [leiningen.new.templates/*dir* dir]
      (->> [file-name (render file-name data)]
           (leiningen.new.templates/->files data)))))

(defn stale-java-classes
  [project]
  (for [dir (:java-source-paths project)
        source (filter #(-> % (.getName) (.endsWith ".java"))
                       (file-seq (io/file dir)))
        :let [rel-source (.substring (.getPath source) (inc (count dir)))
              rel-compiled (.replaceFirst rel-source "\\.java$" ".class")
              compiled (io/file (:compile-path project) rel-compiled)]
        :when (>= (.lastModified source) (.lastModified compiled))]
    (.getCanonicalPath compiled)))

(defn stale-clojure-sources
  [project timestamp]
  (for [dir (:source-paths project)
        source (filter #(-> % (.getName) (.endsWith ".clj"))
                       (file-seq (io/file dir)))
        :when (>= (.lastModified source) timestamp)]
    (.getCanonicalPath source)))

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
  (.exists (io/file path "AndroidManifest.xml")))

(defn is-ios-project?
  [path]
  (.exists (io/file path "Info.plist.xml")))

(defn is-java-project?
  [path]
  (when-let [project (read-project-clj path)]
    (or (:java-only project)
        (= (count (:source-paths project)) 0)
        (clojure.set/subset? (set (:source-paths project))
                             (set (:java-source-paths project))))))

(defn is-clojurescript-project?
  [path]
  (when-let [project (read-project-clj path)]
    (not (nil? (:cljsbuild project)))))

(defn should-run-directly?
  [path]
  (and (is-java-project? path)
       (not (is-android-project? path))
       (not (is-ios-project? path))))

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
                         (io/file path)))
  (.addShutdownHook (Runtime/getRuntime)
                    (Thread. #(when @process (.destroy @process))))
  (with-open [out (io/reader (.getInputStream @process))
              err (io/reader (.getErrorStream @process))
              in (io/writer (.getOutputStream @process))]
    (let [pump-out (doto (Pipe. out *out*) .start)
          pump-err (doto (Pipe. err *err*) .start)
          pump-in (doto (ClosingPipe. *in* in) .start)]
      (.join pump-out)
      (.join pump-err)
      (.waitFor @process)
      (reset! process nil))))

(defn start-process-indirectly
  [process path & args]
  (let [project (read-project-clj path)
        java-cmd (or (:java-cmd project) (System/getenv "JAVA_CMD") "java")
        jar-file (-> (Class/forName class-name)
                     .getProtectionDomain
                     .getCodeSource
                     .getLocation
                     .toURI
                     io/file)]
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
  (let [project-orig (read-project-clj path)
        jvm-opts (conj (:jvm-opts project-orig)
                       (str "-agentlib:jdwp="
                            "transport=dt_socket,"
                            "server=y,"
                            "suspend=n,"
                            "address="
                            debug-port))
        project (-> project-orig
                    (assoc :eval-in :trampoline
                           :jvm-opts jvm-opts))
        forms leiningen.core.eval/trampoline-forms
        profiles leiningen.core.eval/trampoline-profiles]
    (reset! forms [])
    (reset! profiles [])
    (func path project)
    (doseq [i (range (count @forms))]
      (->> (leiningen.core.eval/shell-command project (nth @forms i))
           (start-process process path)))))

(defn stop-process
  [process]
  (when @process
    (.destroy @process)
    (reset! process nil)))

; low-level commands

(defn doall-project-task
  [path project]
  (cond
    (is-android-project? path)
    (when-let [project (read-android-project project)]
      (doseq [cmd ["doall" "repl"]]
        (leiningen.droid/execute-subtask project cmd [])
        (Thread/sleep 20000)))
    :else
    (leiningen.repl/repl project)))

(defn run-project-task
  [path project]
  (cond
    (is-android-project? path)
    (when-let [project (read-android-project project)]
      (doseq [cmd ["run"]]
        (leiningen.droid/execute-subtask project cmd [])))
    (is-ios-project? path)
    (leiningen.fruit/fruit project "doall")
    :else
    (leiningen.run/run project)))

(defn run-repl-project-task
  [path project]
  (cond
    (is-android-project? path)
    (when-let [project (read-android-project project)]
      (doseq [cmd ["run" "forward-port" "repl"]]
        (leiningen.droid/execute-subtask project cmd [])
        (Thread/sleep 10000)))
    :else
    (leiningen.repl/repl project)))

(defn build-project-task
  [path project]
  (cond
    (is-android-project? path)
    (when-let [project (read-android-project project)]
      (doseq [cmd ["build" "apk" "install"]]
        (leiningen.droid/execute-subtask project cmd [])))
    ;(some-> project
    ;        leiningen.droid/transform-into-release
    ;        read-android-project
    ;        leiningen.droid/execute-release-routine)
    ;(is-ios-project? path)
    ;(leiningen.fruit/fruit project "release")
    :else
    (leiningen.uberjar/uberjar project)))

(defn release-project-task
  [path project]
  (cond
    (is-android-project? path)
    (some-> project
            leiningen.droid/transform-into-release
            read-android-project
            leiningen.droid/execute-release-routine)
    (is-ios-project? path)
    (leiningen.fruit/fruit project "release")
    :else
    (leiningen.uberjar/uberjar project)))

(defn test-project-task
  [path project]
  (leiningen.test/test project))

(defn clean-project-task
  [path project]
  (leiningen.clean/clean project))

(defn cljsbuild-project-task
  [path project]
  (leiningen.cljsbuild/cljsbuild project "auto"))

(defn hot-swap-project-task
  [path project]
  (when-let [conn (->> (Bootstrap/virtualMachineManager)
                       .attachingConnectors
                       (filter #(= (.name (.transport %)) "dt_socket"))
                       first)]
     (let [prm (.defaultArguments conn)
           stale-classes (doall (stale-java-classes project))]
       (.setValue (.get prm "port") debug-port)
       (.setValue (.get prm "hostname") "127.0.0.1")
       (when-let [vm (try (.attach conn prm) (catch Exception _))]
         (leiningen.javac/javac project)
         (->> stale-classes
              (create-class-map (.allClasses vm))
              (.redefineClasses vm))
         (.dispose vm)))))

; high-level commands

(defn doall-project
  [process in out path]
  (stop-process process)
  (->> (do (println (utils/get-string :doalling))
         (if (should-run-directly? path)
           (start-process-directly process path doall-project-task)
           (start-process-indirectly process path class-name "doall")))
       (start-thread in out)))

(defn run-project
  [process in out path]
  (stop-process process)
  (->> (do (println (utils/get-string :running))
         (if (should-run-directly? path)
           (start-process-directly process path run-project-task)
           (start-process-indirectly process path class-name "run")))
       (start-thread in out)))

(defn run-repl-project
  [process in out path]
  (stop-process process)
  (->> (do (println (utils/get-string :running_with_repl))
         (if (should-run-directly? path)
           (start-process-directly process path run-repl-project-task)
           (start-process-indirectly process path class-name "repl")))
       (start-thread in out)))

(defn build-project
  [process in out path]
  (stop-process process)
  (->> (do (println (utils/get-string :building))
         (if (should-run-directly? path)
           (start-process-directly process path build-project-task)
           (start-process-indirectly process path class-name "build")))
       (start-thread in out)))

(defn release-project
  [process in out path]
  (stop-process process)
  (->> (do (println (utils/get-string :releasing))
         (if (should-run-directly? path)
           (start-process-directly process path release-project-task)
           (start-process-indirectly process path class-name "release")))
       (start-thread in out)))

(defn test-project
  [process in out path]
  (stop-process process)
  (->> (do (println (utils/get-string :testing))
         (if (should-run-directly? path)
           (start-process-directly process path test-project-task)
           (start-process-indirectly process path class-name "test")))
       (start-thread in out)))

(defn clean-project
  [process in out path]
  (stop-process process)
  (->> (do (println (utils/get-string :cleaning))
         (if (should-run-directly? path)
           (start-process-directly process path clean-project-task)
           (start-process-indirectly process path class-name "clean")))
       (start-thread in out)))

(defn cljsbuild-project
  [process in out path]
  (->> (start-process-indirectly process path class-name "cljsbuild")
       (start-thread in out)))

(defn new-project
  [in out parent-path project-type project-name package-name]
  (->> (cond
         (= project-type :android-clojure)
         (leiningen.droid.new/new project-name package-name)
         (= project-type :ios-clojure)
         (leiningen.fruit/fruit {} "new" project-name package-name)
         (= project-type :ios-java)
         (leiningen.fruit/fruit {} "new-java" project-name package-name)
         :else
         (leiningen.new/new {} (name project-type) project-name package-name))
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
        project (-> (read-project-clj path)
                    leiningen.core.project/init-project)]
    (case cmd
      "doall" (doall-project-task path project)
      "run" (run-project-task path project)
      "repl" (run-repl-project-task path project)
      "build" (build-project-task path project)
      "release" (release-project-task path project)
      "test" (test-project-task path project)
      "clean" (clean-project-task path project)
      "cljsbuild" (cljsbuild-project-task path project)
      nil))
  (System/exit 0))
