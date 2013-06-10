(ns nightcode.utils
  (:use [clojure.java.io :only [file]]))

(def ui-root (atom nil))
(def prefs (.node (java.util.prefs.Preferences/userRoot) "nightcode"))

(defn write-pref
  [k v]
  (.put prefs (name k) (pr-str v)))

(defn read-pref
  [k]
  (when-let [string (.get prefs (name k) nil)]
    (read-string string)))

(defn tree-path-to-str
  [tree-path]
  (-> tree-path
      .getPath
      last
      .getUserObject
      .getCanonicalPath))

(defn get-relative-path [project-path selected-path]
  (-> (.toURI (file project-path))
      (.relativize (.toURI (file selected-path)))
      (.getPath)))

(defn get-relative-dir [project-path selected-path]
  (let [selected-dir (if (.isDirectory (file selected-path))
                       selected-path
                       (-> (file selected-path)
                           .getParentFile
                           .getCanonicalPath))]
    (get-relative-path project-path selected-dir)))

(defn delete-file-recursively [project-path path]
  (when (and (= 0 (count (.listFiles (file path))))
             (not= project-path path))
    (.delete (file path))
    (delete-file-recursively project-path
                             (-> (file path)
                                 .getParentFile
                                 .getCanonicalPath))))
