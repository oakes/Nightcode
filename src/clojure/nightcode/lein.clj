(ns nightcode.lein
  (:require [clojure.java.io :as io]
            [clojure.main]
            [leiningen.core.eval]
            [leiningen.core.main]
            [leiningen.core.project]
            [leiningen.clean]
            [leiningen.javac]
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

(defonce class-name (str *ns*))

; utilities

(defn java-project-map?
  [project]
  (or (:java-only project)
      (= (count (:source-paths project)) 0)
      (clojure.set/subset? (set (:source-paths project))
                           (set (:java-source-paths project)))))

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

; this is necessary because the Reload and Eval buttons cause the REPL
; to show a bunch of => symbols for each newline
(defn add-custom-subsequent-prompt
  [project]
  (assoc-in project
            [:repl-options :subsequent-prompt]
            (fn [ns] "")))

(defn read-project-clj
  [path]
  (when path
    (let [project-clj-path (get-project-clj-path path)]
      (if-not (.exists (io/file project-clj-path))
        (println (utils/get-string :no-project-clj))
        (-> (leiningen.core.project/read-raw project-clj-path)
            add-custom-subsequent-prompt
            (try (catch Exception e {})))))))

(defn create-file-from-template!
  [dir file-name template-namespace data]
  (let [render (leiningen.new.templates/renderer template-namespace)]
    (binding [leiningen.new.templates/*dir* dir
              leiningen.new.templates/*force?* true]
      (->> [file-name (render file-name data)]
           (leiningen.new.templates/->files data)
           io!))))

; start/stop thread/processes

(defn redirect-io
  [[in out] func]
  (binding [*out* out
            *err* out
            *in* in
            leiningen.core.main/*exit-process?* false]
    (func)))

(defn start-thread!*
  [in-out func]
  (->> (fn []
         (try (func)
           (catch Exception e (some-> (.getMessage e) println))
           (finally (println "\n===" (utils/get-string :finished) "==="))))
       (redirect-io in-out)
       (fn [])
       Thread.
       .start))

(defmacro start-thread!
  [in-out & body]
  `(start-thread!* ~in-out (fn [] ~@body)))

(defn start-process!
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

(defn start-process-indirectly!
  [process path & args]
  (let [project (read-project-clj path)
        java-cmd (or (:java-cmd project) (System/getenv "JAVA_CMD") "java")
        jar-uri (utils/get-exec-uri class-name)]
    (start-process! process
                    path
                    java-cmd
                    "-cp"
                    (if (.isDirectory (io/file jar-uri))
                      (System/getProperty "java.class.path")
                      (utils/uri->str jar-uri))
                    args)))

(defn stop-process!
  [process]
  (when @process
    (.destroy @process))
  (reset! process nil))

; low-level commands

(defn run-project-task
  [path project]
  (leiningen.run/run project))

(defn run-repl-project-task
  [path project]
  (leiningen.repl/repl project))

(defn build-project-task
  [path project]
  (leiningen.uberjar/uberjar project))

(defn test-project-task
  [path project]
  (leiningen.test/test project))

(defn clean-project-task
  [path project]
  (leiningen.clean/clean project))

; high-level commands

(defn run-project!
  [process in-out path]
  (stop-process! process)
  (->> (do (println (utils/get-string :running))
         (start-process-indirectly! process path class-name "run"))
       (start-thread! in-out)))

(defn run-repl-project!
  [process in-out path]
  (stop-process! process)
  (->> (do (println (utils/get-string :running-with-repl))
         (start-process-indirectly! process path class-name "repl"))
       (start-thread! in-out)))

(defn build-project!
  [process in-out path]
  (stop-process! process)
  (->> (do (println (utils/get-string :building))
         (start-process-indirectly! process path class-name "build"))
       (start-thread! in-out)))

(defn test-project!
  [process in-out path]
  (stop-process! process)
  (->> (do (println (utils/get-string :testing))
         (start-process-indirectly! process path class-name "test"))
       (start-thread! in-out)))

(defn clean-project!
  [process in-out path]
  (stop-process! process)
  (->> (do (println (utils/get-string :cleaning))
         (start-process-indirectly! process path class-name "clean"))
       (start-thread! in-out)))

(defn new-project!
  [in-out parent-path project-type project-name package-name]
  (->> (leiningen.new/new {} (name project-type) project-name package-name)
       (binding [leiningen.core.main/*info* false])
       (fn []
         (System/setProperty "leiningen.original.pwd" parent-path))
       (redirect-io in-out))
  true)

; main function for "indirect" processes

(defn -main
  [cmd & args]
  (System/setProperty "jline.terminal" "dumb")
  (let [path "."
        project (-> (read-project-clj path)
                    leiningen.core.project/init-project)]
    (case cmd
      "run" (run-project-task path project)
      "repl" (run-repl-project-task path project)
      "build" (build-project-task path project)
      "test" (test-project-task path project)
      "clean" (clean-project-task path project)
      nil))
  (System/exit 0))
