(ns nightcode.lein
  (:require [clojure.java.io :as java.io]
            [clojure.main]
            [leiningen.core.eval]
            [leiningen.core.main]
            [leiningen.core.project]
            [leiningen.clean]
            [leiningen.droid]
            [leiningen.new]
            [leiningen.repl]
            [leiningen.run]
            [leiningen.test]
            [leiningen.uberjar])
  (:import [com.hypirion.io ClosingPipe Pipe])
  (:gen-class))

(def thread (atom nil))
(def process (atom nil))
(def namespace-name (str *ns*))

(defn get-project-clj-path
  [path]
  (.getCanonicalPath (java.io/file path "project.clj")))

(defn read-project-clj
  [path]
  (leiningen.core.project/read (get-project-clj-path path)))

(defn start-thread*
  [in out func]
  (-> (fn []
        (binding [*out* out
                  *err* out
                  *in* in
                  leiningen.core.main/*exit-process?* false]
          (try (func)
            (catch Exception e nil))
          (println "\n=== Finished ===")))
      Thread.
      (doto .start)))

(defmacro start-thread
  [in out & body]
  `(start-thread* ~in ~out (fn [] ~@body)))

(defn start-process
  [& args]
  (reset! process (.exec (Runtime/getRuntime) (into-array (flatten args))))
  (.addShutdownHook (Runtime/getRuntime) (Thread. #(.destroy @process)))
  (with-open [out (java.io/reader (.getInputStream @process))
              err (java.io/reader (.getErrorStream @process))
              in (java.io/writer (.getOutputStream @process))]
    (let [pump-out (doto (Pipe. out *out*) .start)
          pump-err (doto (Pipe. err *err*) .start)
          pump-in (doto (ClosingPipe. *in* in) .start)]
      (.join pump-out)
      (.join pump-err)
      (.join pump-in)
      (.waitFor @process))))

(defn start-process-command
  [cmd path]
  (start-process "java"
                 "-cp"
                 (System/getProperty "java.class.path" ".")
                 namespace-name
                 cmd
                 (get-project-clj-path path)))

(defn halt-project
  []
  (when @process
    (.destroy @process))
  (when @thread
    (.interrupt @thread)))

(defn is-android-project?
  [path]
  (.exists (java.io/file path "AndroidManifest.xml")))

(defn run-project-fast
  [path]
  ;We could do this:
  ;(start-thread in out (start-process-command "run" path))
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
    (start-process cmd)))

(defn run-project
  [in out path]
  (halt-project)
  (->> (do (println "Running...")
         (if (is-android-project? path)
           (start-process-command "run-android" path)
           (run-project-fast path)))
       (start-thread in out)
       (reset! thread)))

(defn run-repl-project
  [in out path]
  (halt-project)
  (->> (do (println "Running with REPL...")
         (start-process-command "repl" path))
       (start-thread in out)
       (reset! thread)))

(defn build-project
  [in out path]
  (halt-project)
  (->> (do (println "Building...")
         (let [cmd (if (is-android-project? path) "build-android" "build")]
           (start-process-command cmd path)))
       (start-thread in out)
       (reset! thread)))

(defn test-project
  [in out path]
  (halt-project)
  (->> (do (println "Testing...")
         (leiningen.test/test (read-project-clj path)))
       (start-thread in out)
       (reset! thread)))

(defn clean-project
  [in out path]
  (halt-project)
  (->> (do (println "Cleaning...")
         (leiningen.clean/clean (read-project-clj path)))
       (start-thread in out)
       (reset! thread)))

(defn new-project
  [parent-path project-name project-type package-name]
  (System/setProperty "leiningen.original.pwd" parent-path)
  (if (= project-type :android)
    (leiningen.droid.new/new project-name package-name)
    (leiningen.new/new {} (name project-type) project-name)))

(defn repl
  [in out]
  (start-thread in out (clojure.main/repl :prompt #(print "user=> "))))

(defn -main
  [& args]
  (System/setProperty "jline.terminal" "dumb")
  (let [project-map (leiningen.core.project/read (nth args 1))]
    (case (nth args 0)
      "run" (leiningen.run/run project-map)
      "run-android" (leiningen.droid/droid project-map "doall")
      "build" (leiningen.uberjar/uberjar project-map)
      "build-android" (leiningen.droid/droid project-map
                                             "release"
                                             "clean-compile-dir"
                                             "build"
                                             "apk")
      "repl" (leiningen.repl/repl project-map)
      nil)))
