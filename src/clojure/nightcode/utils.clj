(ns nightcode.utils
  (:require [clojure.java.io :as java.io])
  (:import [java.util.prefs Preferences]))

(def ui-root (atom nil))
(def prefs (.node (Preferences/userRoot) "nightcode"))

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
  (-> (.toURI (java.io/file project-path))
      (.relativize (.toURI (java.io/file selected-path)))
      (.getPath)))

(defn get-relative-dir [project-path selected-path]
  (let [selected-dir (if (.isDirectory (java.io/file selected-path))
                       selected-path
                       (-> (java.io/file selected-path)
                           .getParentFile
                           .getCanonicalPath))]
    (get-relative-path project-path selected-dir)))

(defn delete-file-recursively [project-path path]
  (when (and (= 0 (count (.listFiles (java.io/file path))))
             (not= project-path path))
    (.delete (java.io/file path))
    (delete-file-recursively project-path
                             (-> (java.io/file path)
                                 .getParentFile
                                 .getCanonicalPath))))

(defn format-name
  [name-str]
  (-> name-str
      clojure.string/lower-case
      (clojure.string/replace " " "")
      (clojure.string/replace "_" "-")))
