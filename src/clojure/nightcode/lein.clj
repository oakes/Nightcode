(ns nightcode.lein
  (:require [clojure.java.io :as java.io]
            [clojure.main]
            [leiningen.core.eval]
            [leiningen.core.main]
            [leiningen.core.project]
            [leiningen.clean]
            [leiningen.cljsbuild]
            [leiningen.droid]
            [leiningen.new]
            [leiningen.new.templates]
            [leiningen.trampoline]
            [leiningen.repl]
            [leiningen.run]
            [leiningen.test]
            [leiningen.uberjar]
            [nightcode.utils :as utils])
  (:import [com.hypirion.io ClosingPipe Pipe])
  (:gen-class))

; utilities

(defn get-project-clj-path
  [path]
  (.getCanonicalPath (java.io/file path "project.clj")))

(defn read-project-clj
  [path]
  (let [project-clj-path (get-project-clj-path path)]
    (if-not (.exists (java.io/file project-clj-path))
      (println (utils/get-string :no_project_clj))
      (leiningen.core.project/read project-clj-path))))

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

; start/stop thread/processes

(defn redirect-io
  [in out func]
  (binding [*out* out
            *err* out
            *in* in
            leiningen.core.main/*exit-process?* false]
    (func)))

(defn start-thread*
  [thread in out func]
  (->> (fn []
         (try (func)
           (catch InterruptedException e nil)
           (catch Exception e (println (.getMessage e))))
         (println "\n===" (utils/get-string :finished) "==="))
       (redirect-io in out)
       (fn [])
       Thread.
       (reset! thread)
       .start))

(defmacro start-thread
  [thread in out & body]
  `(start-thread* ~thread ~in ~out (fn [] ~@body)))

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
      (.waitFor @process))))

(defn start-slow-process
  [process path cmd]
  (let [project-map (read-project-clj path)
        java-cmd (or (:java-cmd project-map) (System/getenv "JAVA_CMD") "java")]
    (start-process process
                   path
                   java-cmd
                   "-cp"
                   (System/getProperty "java.class.path")
                   (.getCanonicalName nightcode.lein)
                   cmd)))

(defn start-fast-process
  [process path func]
  (let [project-map (-> (read-project-clj path)
                        (assoc :eval-in :trampoline))
        forms leiningen.core.eval/trampoline-forms
        profiles leiningen.core.eval/trampoline-profiles]
    (reset! forms [])
    (reset! profiles [])
    (func path project-map)
    (doseq [i (range (count @forms))]
      (->> (let [form (nth @forms i)
                 profile (nth @profiles i)
                 project-map (leiningen.core.project/set-profiles
                               project-map [profile])]
             (leiningen.core.eval/shell-command project-map form))
           (start-process process path)))))

(defn stop-process
  [process]
  (when @process
    (.destroy @process)
    (reset! process nil)))

(defn stop-thread
  [thread]
  (when @thread
    (.interrupt @thread)
    (reset! thread nil)))

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

; high-level commands

(defn run-project
  [process thread in out path]
  (stop-process process)
  (stop-thread thread)
  (->> (do (println (utils/get-string :running))
         (if (is-clojurescript-project? path)
           (start-slow-process process path "run")
           (start-fast-process process path run-project-task)))
       (start-thread thread in out)))

(defn run-repl-project
  [process thread in out path]
  (stop-process process)
  (stop-thread thread)
  (->> (do (println (utils/get-string :running_with_repl))
         (start-slow-process process path "repl"))
       (start-thread thread in out)))

(defn build-project
  [process thread in out path]
  (stop-process process)
  (stop-thread thread)
  (->> (do (println (utils/get-string :building))
         (if (is-clojurescript-project? path)
           (start-slow-process process path "build")
           (start-fast-process process path build-project-task)))
       (start-thread thread in out)))

(defn test-project
  [process thread in out path]
  (stop-process process)
  (stop-thread thread)
  (->> (do (println (utils/get-string :testing))
         (if (is-clojurescript-project? path)
           (start-slow-process process path "test")
           (start-fast-process process path test-project-task)))
       (start-thread thread in out)))

(defn clean-project
  [process thread in out path]
  (stop-process process)
  (stop-thread thread)
  (->> (do (println (utils/get-string :cleaning))
         (if (is-clojurescript-project? path)
           (start-slow-process process path "clean")
           (start-fast-process process path clean-project-task)))
       (start-thread thread in out)))

(defn new-project
  [in out parent-path project-type project-name package-name]
  (->> (try
         (if (= project-type :android)
           (leiningen.droid.new/new project-name package-name)
           (leiningen.new/new {} (name project-type) project-name package-name))
         (catch Exception _))
       (fn []
         (System/setProperty "leiningen.original.pwd" parent-path))
       (redirect-io in out)))

(defn run-repl
  [thread in out]
  (stop-thread thread)
  (->> (clojure.main/repl :caught (fn [e] (println)))
       (start-thread thread in out)))

(defn run-logcat
  [process thread in out path]
  (stop-process process)
  (stop-thread thread)
  (->> (start-process process
                      nil
                      (-> (read-project-clj path)
                          leiningen.droid.utils/get-default-android-params
                          :adb-bin)
                      "logcat"
                      "*:I")
       (binding [leiningen.core.main/*exit-process?* false])
       (start-thread thread in out)))

; main function for "slow" processes

(defn -main
  [cmd & args]
  (System/setProperty "jline.terminal" "dumb")
  (let [path "."
        project-map (leiningen.core.project/init-project
                      (read-project-clj path))]
    (case cmd
      "build" (build-project-task path project-map)
      "clean" (clean-project-task path project-map)
      "repl" (run-repl-project-task path project-map)
      "run" (run-project-task path project-map)
      "test" (test-project-task path project-map)
      nil))
  (System/exit 0))
