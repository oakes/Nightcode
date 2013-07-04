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
            [leiningen.uberjar]
            [nightcode.utils :as utils]
            [seesaw.core :as s])
  (:import (clojure.lang LineNumberingPushbackReader)
           (com.hypirion.io ClosingPipe Pipe))
  (:gen-class))

(def threads (atom {}))
(def process (atom nil))

(defn get-project-clj-path
  [path]
  (.getCanonicalPath (java.io/file path "project.clj")))

(defn read-project-clj
  [path]
  (leiningen.core.project/read (get-project-clj-path path)))

(defn get-output
  [widget-id]
  (.getOut (s/select @utils/ui-root [widget-id])))

(defn get-input
  [widget-id]
  (.getIn (s/select @utils/ui-root [widget-id])))

(defn start-thread*
  [widget-id func]
  (->> (fn []
         (binding [*out* (get-output widget-id)
                   *err* (get-output widget-id)
                   *in* (LineNumberingPushbackReader. (get-input widget-id))
                   leiningen.core.main/*exit-process?* false]
           (try (func)
             (catch Exception e nil))
           (println "=== Finished ===")))
       Thread.
       (swap! threads assoc widget-id))
  (.start (get @threads widget-id)))

(defmacro start-thread
  [widget-id & body]
  `(start-thread* ~widget-id (fn [] ~@body)))

(defn start-process
  [& args]
  (reset! process (.exec (Runtime/getRuntime) (into-array (flatten args))))
  (.addShutdownHook (Runtime/getRuntime)
                    (Thread. (fn [] (.destroy @process))))
  (with-open [out (java.io/reader (.getInputStream @process))
              err (java.io/reader (.getErrorStream @process))
              in (.getOutputStream @process)]
    (let [pump-out (doto (Pipe. out *out*) .start)
          pump-err (doto (Pipe. err *err*) .start)
          pipe-in (ClosingPipe. System/in in)]
      (.join pump-out)
      (.join pump-err)
      (.waitFor @process))))

(defn start-process-command
  [cmd path]
  (println "Please wait...")
  (start-process "java"
                 "-cp"
                 (System/getProperty "java.class.path" ".")
                 "nightcode.lein"
                 cmd
                 (get-project-clj-path path)))

(defn cancel-action
  []
  (when @process
    (.destroy @process))
  (when-let [thread (:#build-console @threads)]
    (.interrupt thread)))

(defn is-android-project?
  [path project-map]
  (let [has-manifest? (-> (java.io/file path "AndroidManifest.xml")
                          .exists)]
    (when (and has-manifest? (not (:sdk-path (:android project-map))))
      (-> (s/dialog
            :title "Specify Android SDK"
            :content
"No Android SDK was found. You can specify it in 
project.clj, or you can set it globally by putting 
the following in your ~/.lein/profiles.clj file and 
restarting the IDE:

{:user {
  :android {:sdk-path \"/path/to/android-sdk\"}
}}"
            :type :plain)
          s/pack!
          s/show!)
      (throw (Throwable. "No Android SDK was found")))
    has-manifest?))

(defn run-project
  [path]
  (cancel-action)
  (let [project-map (read-project-clj path)]
    (if (is-android-project? path project-map)
      (start-thread :#build-console (start-process-command "run-android" path))
      ;We could do this:
      ;(start-thread :#build-console (start-process-command "run" path))
      ;But instead we are calling the Leiningen code directly for speed:
      (start-thread
        :#build-console
        (leiningen.core.eval/prep project-map)
        (let [given (:main project-map)
              form (leiningen.run/run-form given nil)
              main (if (namespace (symbol given))
                     (symbol given)
                     (symbol (name given) "-main"))
              new-form `(do (set! ~'*warn-on-reflection*
                                  ~(:warn-on-reflection project-map))
                            ~@(map (fn [[k v]]
                                     `(set! ~k ~v)) (:global-vars project-map))
                            ~@(:injections project-map)
                            ~form)
              cmd (leiningen.core.eval/shell-command project-map new-form)]
          (start-process cmd))))))

(defn build-project
  [path]
  (cancel-action)
  (let [project-map (read-project-clj path)
        cmd (if (is-android-project? path project-map) "build-android" "build")]
    (start-thread :#build-console (start-process-command cmd path))))

(defn test-project
  [path]
  (cancel-action)
  (start-thread :#build-console (leiningen.test/test (read-project-clj path))))

(defn clean-project
  [path]
  (cancel-action)
  (start-thread :#build-console
                (println "Cleaning...")
                (leiningen.clean/clean (read-project-clj path))))

(defn new-project
  ([path project-name project-type]
   (new-project path project-name project-type nil))
  ([path project-name project-type package-name]
   (System/setProperty "leiningen.original.pwd" path)
   (if (= project-type :android)
     (leiningen.droid.new/new project-name package-name)
     (leiningen.new/new {} (name project-type) project-name))))

(defn run-repl
  []
  (start-thread :#repl-console (clojure.main/repl :prompt #(print "user=> "))))

(defn -main
  [& args]
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
      nil)))
