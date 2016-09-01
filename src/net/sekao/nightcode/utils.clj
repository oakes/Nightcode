(ns net.sekao.nightcode.utils
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [net.sekao.nightcode.spec :as spec]
            [clojure.spec :as s :refer [fdef]])
  (:import [java.io File]
           [java.nio.file Paths]))

(defmacro with-security [& body]
  `(do
     (System/setProperty "java.security.policy"
                        (-> "java.policy" io/resource .toString))
     (System/setSecurityManager
       (proxy [SecurityManager] []
         (checkExit [status#]
           (throw (SecurityException. "Exit not allowed.")))))
     (try ~@body
       (finally (System/setSecurityManager nil)))))

(defn get-relative-path
  "Returns the selected path as a relative URI to the project path."
  [project-path selected-path]
  (-> (.toURI (io/file project-path))
      (.relativize (.toURI (io/file selected-path)))
      (.getPath)))

(defn delete-parents-recursively!
  "Deletes the given file along with all empty parents unless they are in project-set."
  [project-set path]
  (let [f (io/file path)]
    (when (and (zero? (count (.listFiles f)))
               (not (contains? project-set path)))
      (io/delete-file f true)
      (->> f
           .getParentFile
           .getCanonicalPath
           (delete-parents-recursively! project-set))))
  nil)

(defn delete-children-recursively!
  "Deletes the children of the given dir along with the dir itself."
  [path]
  (let [f (io/file path)]
    (when (.isDirectory f)
      (doseq [f2 (.listFiles f)]
        (delete-children-recursively! f2)))
    (io/delete-file f))
  nil)

(defn get-project-root-path
  "Returns the root path that the selected path is contained within."
  [pref-state]
  (when-let [^String selected-path (:selection pref-state)]
    (-> #(or (.startsWith selected-path (str % File/separator))
           (= selected-path %))
        (filter (:project-set pref-state))
        first)))

(defn build-systems
  "Returns a set containing :boot and/or :lein if the given path contains the
requisite project files, or empty if neither exists."
  [^String path]
  (let [file (io/file path)
        dir? (.isDirectory file)
        types #{}
        types (if (and dir? (.exists (io/file file "build.boot")))
                (conj types :boot)
                types)
        types (if (and dir? (.exists (io/file file "project.clj")))
                (conj types :lein)
                types)]
    types))

(defn get-project-path
  "Returns the project path that the given path is contained within."
  ([pref-state]
   (when-let [^String selected-path (:selection pref-state)]
     (get-project-path selected-path pref-state)))
  ([path pref-state]
   (if-let [file (try (io/file path) (catch Exception _))]
     (if (or (-> path build-systems count pos?)
             (contains? (:project-set pref-state) path))
       path
       (when-let [parent-file (.getParentFile file)]
         (get-project-path (.getCanonicalPath parent-file) pref-state)))
     path)))

(defn parent-path?
  "Determines if the given parent path is equal to or a parent of the child."
  [^String parent-path ^String child-path]
  (or (= parent-path child-path)
      (and parent-path
           child-path
           (.isDirectory (io/file parent-path))
           (.startsWith child-path (str parent-path File/separator)))
      false))

(defn get-extension
  "Returns the extension in the given path name."
  [^String path]
  (->> (.lastIndexOf path ".")
       (+ 1)
       (subs path)
       str/lower-case))

(defn uri->str
  "Converts a java.net.URI to a String."
  [uri]
  (-> uri Paths/get .normalize .toString))

(defn get-exec-uri
  "Returns the executable as a java.net.URI."
  [class-name]
  (-> (Class/forName class-name)
      .getProtectionDomain
      .getCodeSource
      .getLocation
      .toURI))

(defn remove-returns [^String s]
  (str/escape s {\return ""}))

(defn remove-ansi [^String s]
  (str/replace s #"\e\[\d*." ""))

(defn get-boot-path []
  (let [windows? (.startsWith (System/getProperty "os.name") "Windows")
        file-name (if windows? "boot.exe" "boot.sh")
        file (io/file (System/getProperty "user.home") (str ".nightcode-" file-name))]
    (when-not (.exists file)
      (-> file-name io/resource io/input-stream (io/copy file)))
    (when-not windows?
      (-> file
          .toPath
          (java.nio.file.Files/setPosixFilePermissions
            (-> (java.nio.file.attribute.PosixFilePermission/values)
                (java.util.Arrays/asList)
                (java.util.HashSet.)))))
    (.getCanonicalPath file)))

(defn get-boot-tasks [project-path]
  (try
    (let [path (.getCanonicalPath (io/file project-path "build.boot"))
          rdr (java.io.PushbackReader. (io/reader path))]
      (loop [tasks []]
        (if-let [form (try (read rdr)
                        (catch Exception _))]
          (if (= 'deftask (first form))
            (recur (conj tasks (str (second form))))
            (recur tasks))
          tasks)))
    (catch Exception _ [])))

; specs

(fdef get-relative-path
  :args (s/cat :project-path string? :selected-path string?)
  :ret string?)

(fdef delete-parents-recursively!
  :args (s/cat :project-set set? :path string?))

(fdef delete-children-recursively!
  :args (s/cat :path string?))

(fdef get-project-root-path
  :args (s/cat :pref-state map?)
  :ret (s/nilable string?))

(fdef build-systems
  :args (s/cat :path string?)
  :ret (s/coll-of keyword?))

(fdef get-project-path
  :args (s/alt
          :one-arg (s/cat :pref-state map?)
          :two-args (s/cat :path string? :pref-state map?))
  :ret (s/nilable string?))

(fdef parent-path?
  :args (s/cat :parent-path string? :child-path (s/nilable string?))
  :ret boolean?)

(fdef get-extension
  :args (s/cat :path string?)
  :ret string?)

(fdef uri->str
  :args (s/cat :uri #(instance? java.net.URI %))
  :ret string?)

(fdef get-exec-uri
  :args (s/cat :class-name string?)
  :ret #(instance? java.net.URI %))

(fdef remove-returns
  :args (s/cat :s string?)
  :ret string?)

(fdef remove-ansi
  :args (s/cat :s string?)
  :ret string?)

(fdef windows?
  :args (s/cat)
  :ret boolean?)

(fdef get-shell
  :args (s/cat)
  :ret (s/nilable string?))

(fdef get-boot-path
  :args (s/cat)
  :ret string?)

(fdef get-boot-tasks
  :args (s/cat :project-path string?)
  :ret (s/coll-of string?))

