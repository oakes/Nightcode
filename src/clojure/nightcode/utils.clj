(ns nightcode.utils
  (:require [clojure.java.io :as java.io]
            [clojure.xml :as xml])
  (:import [bsh.util JConsole]
           [clojure.lang LineNumberingPushbackReader]
           [java.util Locale]
           [java.util.prefs Preferences]))

; ui

(def ui-root (atom nil))

(defn create-console
  []
  (JConsole.))

(defn get-console-input
  [console]
  (LineNumberingPushbackReader. (.getIn console)))

(defn get-console-output
  [console]
  (.getOut console))

(defn shut-down
  []
  (System/exit 0))

; preferences

(def prefs (.node (Preferences/userRoot) "nightcode"))

(defn write-pref
  [k v]
  (.put prefs (name k) (pr-str v)))

(defn read-pref
  [k]
  (when-let [string (.get prefs (name k) nil)]
    (read-string string)))

; language

(def lang-files {"en" "values/strings.xml"})
(def lang-strings (-> (get lang-files (.getLanguage (Locale/getDefault)))
                      (or (get lang-files "en"))
                      java.io/resource
                      .toString
                      xml/parse
                      :content))

(defn get-string
  "Returns the localized string for the given keyword."
  [res-name]
  (if (keyword? res-name)
    (-> (filter #(= (get-in % [:attrs :name]) (name res-name))
                lang-strings)
        first
        :content
        first
        (or "")
        (clojure.string/replace "\\" ""))
    res-name))

; paths and encodings

(defn tree-path-to-str
  [tree-path]
  (-> tree-path
      .getPath
      last
      .getUserObject
      :file
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
  (let [file (java.io/file path)]
    (when (and (= 0 (count (.listFiles file)))
               (not= project-path path))
      (.delete file)
      (->> file
           .getParentFile
           .getCanonicalPath
           (delete-file-recursively project-path)))))

(defn format-name
  [name-str project-type]
  (if (and project-type (>= (.indexOf (name project-type) "java") 0))
    (-> name-str
        (clojure.string/replace "-" "_")
        (clojure.string/replace #"[^a-zA-Z0-9_.]" ""))
    (-> name-str
        clojure.string/lower-case
        (clojure.string/replace "_" "-")
        (clojure.string/replace #"[^a-z0-9-.]" ""))))
