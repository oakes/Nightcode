(ns net.sekao.nightcode.utils
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [net.sekao.nightcode.spec :as spec]
            [clojure.spec :as s :refer [fdef]])
  (:import [java.io File]))

(defmacro with-security [body]
  `(do
     (System/setProperty "java.security.policy"
                        (-> "java.policy" io/resource .toString))
     (System/setSecurityManager
       (proxy [SecurityManager] []
         (checkExit [status#]
           (throw (SecurityException. "Exit not allowed.")))))
     (let [result# ~body]
       (System/setSecurityManager nil)
       result#)))

(fdef get-relative-path
  :args (s/cat :project-path string? :selected-path string?)
  :ret string?)
(defn get-relative-path
  "Returns the selected path as a relative URI to the project path."
  [project-path selected-path]
  (-> (.toURI (io/file project-path))
      (.relativize (.toURI (io/file selected-path)))
      (.getPath)))

(fdef delete-parents-recursively!
  :args (s/cat :project-set set? :path string?))
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

(fdef delete-children-recursively!
  :args (s/cat :path string?))
(defn delete-children-recursively!
  "Deletes the children of the given dir along with the dir itself."
  [path]
  (let [f (io/file path)]
    (when (.isDirectory f)
      (doseq [f2 (.listFiles f)]
        (delete-children-recursively! f2)))
    (io/delete-file f))
  nil)

(fdef get-project-root-path
  :args (s/cat :state map?)
  :ret (s/nilable string?))
(defn get-project-root-path
  "Returns the root path that the selected path is contained within."
  [state]
  (when-let [^String selected-path (:selection state)]
    (-> #(or (.startsWith selected-path (str % File/separator))
           (= selected-path %))
        (filter (:project-set state))
        first)))

(fdef parent-path?
  :args (s/cat :parent-path string? :child-path (s/nilable string?))
  :ret spec/boolean?)
(defn parent-path?
  "Determines if the given parent path is equal to or a parent of the child."
  [^String parent-path ^String child-path]
  (or (= parent-path child-path)
      (and parent-path
           child-path
           (.isDirectory (io/file parent-path))
           (.startsWith child-path (str parent-path File/separator)))
      false))

(fdef get-extension
  :args (s/cat :path string?)
  :ret string?)
(defn get-extension
  "Returns the extension in the given path name."
  [^String path]
  (->> (.lastIndexOf path ".")
       (+ 1)
       (subs path)
       str/lower-case))
