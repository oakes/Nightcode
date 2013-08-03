(ns nightcode.lein
  (:require [clojure.edn :as edn]
            [clojure.java.io :as java.io]
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

(def namespace-name (str *ns*))

(defn get-project-clj-path
  [path]
  (.getCanonicalPath (java.io/file path "project.clj")))

(defn read-project-clj
  [path]
  (let [project-clj-path (get-project-clj-path path)]
    (if-not (.exists (java.io/file project-clj-path))
      (println (utils/get-string :no_project_clj))
      (when-let [project-map (leiningen.core.project/read project-clj-path)]
        (assoc-in project-map
                  [:android :sdk-path]
                  (or (get-in project-map [:android :sdk-path])
                      (utils/read-pref :android-sdk)))))))

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

(defn start-internal-process
  [process path cmd args]
  (let [project-map (read-project-clj path)
        java-cmd (or (:java-cmd project-map) (System/getenv "JAVA_CMD") "java")]
    (start-process process
                   path
                   java-cmd
                   "-cp"
                   (System/getProperty "java.class.path")
                   namespace-name
                   cmd
                   (or args []))))

(defn start-lein-process
  [process path func]
  (let [project-map (-> (read-project-clj path)
                        leiningen.core.project/init-project
                        (assoc :eval-in :trampoline))
        forms leiningen.core.eval/trampoline-forms
        profiles leiningen.core.eval/trampoline-profiles]
    (reset! forms [])
    (reset! profiles [])
    (func project-map)
    (doseq [i (range (count @forms))]
      (->> (str "["
                (leiningen.trampoline/trampoline-command-string
                  project-map [(nth @forms i)] [(nth @profiles i)])
                "]")
           clojure.edn/read-string
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

(defn create-file-from-template
  [dir file-name template-namespace data]
  (let [render (leiningen.new.templates/renderer template-namespace)]
    (binding [leiningen.new.templates/*dir* dir]
      (->> [file-name (render file-name data)]
           (leiningen.new.templates/->files data)))))

(defn run-project
  [process thread in out path args]
  (stop-process process)
  (stop-thread thread)
  (->> (fn [project-map]
         (if (is-android-project? path)
           (doseq [sub-cmd ["build" "apk" "install" "run"]]
             (apply leiningen.droid/droid project-map sub-cmd args))
           (leiningen.run/run project-map)))
       (start-lein-process process path)
       (do (println (utils/get-string :running)))
       (start-thread thread in out)))

(defn run-repl-project
  [process thread in out path args]
  (stop-process process)
  (stop-thread thread)
  (->> (do (println (utils/get-string :running_with_repl))
         (start-internal-process process path "repl" args))
       (start-thread thread in out)))

(defn build-project
  [process thread in out path args]
  (stop-process process)
  (stop-thread thread)
  (->> (fn [project-map]
         (if (is-android-project? path)
           (apply leiningen.droid/droid project-map "release" args)
           (leiningen.uberjar/uberjar project-map)))
       (start-lein-process process path)
       (do (println (utils/get-string :building)))
       (start-thread thread in out)))

(defn test-project
  [process thread in out path]
  (stop-process process)
  (stop-thread thread)
  (->> (let [project-map (read-project-clj path)]
         (println (utils/get-string :testing))
         (leiningen.test/test project-map)
         (when (:cljsbuild project-map)
           (leiningen.cljsbuild/cljsbuild project-map "test")))
       (start-thread thread in out)))

(defn clean-project
  [process thread in out path]
  (stop-process process)
  (stop-thread thread)
  (->> (let [project-map (read-project-clj path)]
         (println (utils/get-string :cleaning))
         (leiningen.clean/clean project-map)
         (when (:cljsbuild project-map)
           (leiningen.cljsbuild/cljsbuild project-map "clean")))
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

(defn -main
  [cmd & args]
  (System/setProperty "jline.terminal" "dumb")
  (let [path "."
        project-map (leiningen.core.project/init-project
                      (read-project-clj path))
        android? (is-android-project? path)]
    (case cmd
      "repl" (if android?
               (doseq [sub-cmd ["doall" "repl"]]
                 (apply leiningen.droid/droid project-map sub-cmd args)
                 (Thread/sleep 10000))
               (leiningen.repl/repl project-map))
      nil))
  (System/exit 0))
