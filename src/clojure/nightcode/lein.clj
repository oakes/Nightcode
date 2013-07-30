(ns nightcode.lein
  (:require [clojure.java.io :as java.io]
            [clojure.main]
            [leiningen.core.eval]
            [leiningen.core.main]
            [leiningen.core.project]
            [leiningen.clean]
            [leiningen.droid]
            [leiningen.new]
            [leiningen.new.templates]
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

(defn start-thread*
  [thread in out func]
  (->> (fn []
         (binding [*out* out
                   *err* out
                   *in* in
                   leiningen.core.main/*exit-process?* false]
           (try (func)
             (catch InterruptedException e nil)
             (catch Exception e (println (.getMessage e))))
           (println "\n===" (utils/get-string :finished) "===")))
       Thread.
       (reset! thread))
  (.start @thread))

(defmacro start-thread
  [thread in out & body]
  `(start-thread* ~thread ~in ~out (fn [] ~@body)))

(defn start-process
  [process & args]
  (reset! process (.exec (Runtime/getRuntime) (into-array (flatten args))))
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

(defn start-process-command
  [process cmd path]
  (let [project-map (read-project-clj path)
        java-cmd (or (:java-cmd project-map) (System/getenv "JAVA_CMD") "java")]
    (start-process process
                   java-cmd
                   "-cp"
                   (System/getProperty "java.class.path" ".")
                   namespace-name
                   cmd
                   path)))

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

(defn run-project-fast
  [process path]
  ;We could do this:
  ;(start-process-command process "run" path)
  ;But instead we are calling the Leiningen code directly for speed:
  (let [project-map (read-project-clj path)
        _ (leiningen.core.eval/prep project-map)
        given (:main project-map)
        form (leiningen.run/run-form given nil)
        main (if (namespace (symbol given))
               (symbol given)
               (symbol (name given) "-main"))
        new-form `(do (set! ~'*warn-on-reflection*
                            ~(:warn-on-reflection project-map))
                      ~@(map (fn [[k v]]
                               `(set! ~k ~v))
                             (:global-vars project-map))
                      ~@(:injections project-map)
                      ~form)
        cmd (leiningen.core.eval/shell-command project-map new-form)]
    (start-process process cmd)))

(defn run-project
  [process thread in out path]
  (stop-process process)
  (stop-thread thread)
  (->> (do (println (utils/get-string :running))
         (if (is-android-project? path)
           (start-process-command process "run-android" path)
           (run-project-fast process path)))
       (start-thread thread in out)))

(defn run-repl-project
  [process thread in out path]
  (stop-process process)
  (stop-thread thread)
  (->> (do (println (utils/get-string :running_with_repl))
         (let [cmd (if (is-android-project? path) "repl-android" "repl")]
           (start-process-command process cmd path)))
       (start-thread thread in out)))

(defn build-project
  [process thread in out path]
  (stop-process process)
  (stop-thread thread)
  (->> (do (println (utils/get-string :building))
         (let [cmd (if (is-android-project? path) "build-android" "build")]
           (start-process-command process cmd path)))
       (start-thread thread in out)))

(defn test-project
  [thread in out path]
  (stop-thread thread)
  (->> (do (println (utils/get-string :testing))
         (leiningen.test/test (read-project-clj path)))
       (start-thread thread in out)))

(defn clean-project
  [thread in out path]
  (stop-thread thread)
  (->> (do (println (utils/get-string :cleaning))
         (leiningen.clean/clean (read-project-clj path)))
       (start-thread thread in out)))

(defn new-project
  [parent-path project-type project-name package-name]
  (System/setProperty "leiningen.original.pwd" parent-path)
  (if (= project-type :android)
    (leiningen.droid.new/new project-name package-name ":target-sdk" "15")
    (leiningen.new/new {} (name project-type) project-name package-name)))

(defn run-repl
  [thread in out]
  (stop-thread thread)
  (->> (clojure.main/repl :prompt #(print "user=> "))
       (start-thread thread in out)))

(defn run-logcat
  [process thread in out path]
  (stop-process process)
  (stop-thread thread)
  (let [project-map (read-project-clj path)
        params (leiningen.droid.utils/get-default-android-params project-map)]
    (->> (start-process process (:adb-bin params) "logcat" "*:I")
         (start-thread thread in out))))

(defn -main
  [& args]
  (System/setProperty "jline.terminal" "dumb")
  (let [project-map (read-project-clj (nth args 1))]
    (case (nth args 0)
      "run" (leiningen.run/run project-map)
      "run-android" (doseq [cmd ["build" "apk" "install" "run"]]
                      (leiningen.droid/droid project-map cmd))
      "build" (leiningen.uberjar/uberjar project-map)
      "build-android" (leiningen.droid/droid project-map "release")
      "repl" (leiningen.repl/repl project-map)
      "repl-android" (doseq [cmd ["doall" "repl"]]
                       (leiningen.droid/droid project-map cmd)
                       (Thread/sleep 10000))
      nil)))
