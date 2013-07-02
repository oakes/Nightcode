(ns nightcode.lein
  (:require [clojure.java.io :as java.io]
            [leiningen.core.main]
            [leiningen.core.eval]
            [leiningen.core.project]
            [leiningen.run]
            [leiningen.uberjar]
            [leiningen.test]
            [leiningen.clean]
            [leiningen.new]
            [leiningen.droid]
            [nightcode.utils :as utils]
            [seesaw.core :as s])
  (:import (com.hypirion.io Pipe ClosingPipe)
           (java.util Arrays))
  (:gen-class))

(def threads (atom []))
(def processes (atom []))

(defn get-project-clj-path
  [project-path]
  (.getCanonicalPath (java.io/file project-path "project.clj")))

(defn read-project-clj
  [project-path]
  (leiningen.core.project/read (get-project-clj-path project-path)))

(defn start-thread*
  [func]
  (->> (fn []
         (with-open [os (proxy [java.io.OutputStream] []
                          (write [buf off len]
                            (let [new-buf (Arrays/copyOfRange buf off len)
                                  new-str (apply str (map char new-buf))]
                              (s/invoke-now
                                (-> (s/select @utils/ui-root [:#build-console])
                                    (.print new-str))))))
                     osw (java.io.OutputStreamWriter. os)]
           (binding [*out* osw
                     *err* osw
                     leiningen.core.main/*exit-process?* false]
             (try (func) (catch Exception e nil))
             (println "=== Finished ==="))))
       (Thread.)
       (swap! threads conj)
       last
       .start))

(defmacro start-thread
  [& body]
  `(start-thread* (fn [] ~@body)))

(defn start-process
  [& args]
  (let [process (.exec (Runtime/getRuntime) (into-array (flatten args)))]
    (swap! processes conj process)
    (.addShutdownHook (Runtime/getRuntime)
                      (Thread. (fn [] (.destroy process))))
    (with-open [out (java.io/reader (.getInputStream process))
                err (java.io/reader (.getErrorStream process))
                in (.getOutputStream process)]
      (let [pump-out (doto (Pipe. out *out*) .start)
            pump-err (doto (Pipe. err *err*) .start)
            pipe-in (ClosingPipe. System/in in)]
        (.join pump-out)
        (.join pump-err)
        (.waitFor process)))))

(defn start-process-command
  [project-path cmd]
  (println "Please wait...")
  (start-process "java"
                 "-cp"
                 (System/getProperty "java.class.path" ".")
                 "nightcode.lein"
                 cmd
                 (get-project-clj-path project-path)))

(defn cancel-action
  []
  (doseq [thread @threads]
    (.interrupt thread))
  (doseq [process @processes]
    (.destroy process))
  (reset! threads [])
  (reset! processes []))

(defn is-android-project?
  [project-path project-map]
  (let [has-manifest? (-> (java.io/file project-path "AndroidManifest.xml")
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
  [project-path]
  (cancel-action)
  (let [project-map (read-project-clj project-path)]
    (if (is-android-project? project-path project-map)
      (start-thread (start-process-command project-path "run-android"))
      ;We could do this:
      ;(start-thread (start-process-command project-path "run"))
      ;But instead we are calling the Leiningen code directly for speed:
      (start-thread
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
  [project-path]
  (cancel-action)
  (let [project-map (read-project-clj project-path)]
    (if (is-android-project? project-path project-map)
      (start-thread (start-process-command project-path "build-android"))
      (start-thread (start-process-command project-path "build")))))

(defn test-project
  [project-path]
  (cancel-action)
  (start-thread (leiningen.test/test (read-project-clj project-path))))

(defn clean-project
  [project-path]
  (cancel-action)
  (start-thread (println "Cleaning...")
                (leiningen.clean/clean (read-project-clj project-path))))

(defn new-project
  ([project-path project-name project-type]
   (new-project project-path project-name project-type nil))
  ([project-path project-name project-type package-name]
   (System/setProperty "leiningen.original.pwd" project-path)
   (if (= project-type :android)
     (leiningen.droid.new/new project-name package-name)
     (leiningen.new/new {} (name project-type) project-name))))

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
