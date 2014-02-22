(ns nightcode.utils
  (:require [clojure.edn :as edn]
            [clojure.java.io :as io]
            [clojure.xml :as xml])
  (:import [java.io File]
           [java.net URL]
           [java.nio.file Files Path]
           [java.util Locale]
           [java.util.jar Manifest]
           [java.util.prefs Preferences]
           [javax.swing.tree TreePath]))

; preferences

(def ^Preferences prefs (.node (Preferences/userRoot) "nightcode"))

(defn write-pref!
  "Writes a key-value pair to the preference file."
  [k v]
  (io! (.put prefs (name k) (pr-str v))))

(defn read-pref
  "Reads value from the given key in the preference file."
  [k]
  (when-let [string (.get prefs (name k) nil)]
    (edn/read-string string)))

; language

(def lang-files {"en" "nightcode_en.xml"})
(def lang-strings (-> (get lang-files (.getLanguage (Locale/getDefault)))
                      (or (get lang-files "en"))
                      io/resource
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

(defn get-exec-file
  "Returns the executable as a java.io.File."
  [class-name]
  (-> (Class/forName class-name)
      .getProtectionDomain
      .getCodeSource
      .getLocation
      .toURI
      io/file))

(defn get-project
  "Returns the project.clj file as a list."
  [class-name]
  (when (.isFile (get-exec-file class-name))
    (->> (io/resource "project.clj")
         slurp
         read-string
         (binding [*read-eval* false]))))

(defn tree-path-to-str
  "Gets the string path for the given JTree path object."
  [^TreePath tree-path]
  (some-> tree-path
          .getPath
          last
          .getUserObject
          :file
          .getCanonicalPath))

(defn get-relative-path
  "Returns the selected path as a relative URI to the project path."
  [project-path selected-path]
  (-> (.toURI (io/file project-path))
      (.relativize (.toURI (io/file selected-path)))
      (.getPath)))

(defn get-relative-dir
  "Returns the selected directory as a relative URI to the project path."
  [project-path selected-path]
  (let [selected-dir (if (.isDirectory (io/file selected-path))
                       selected-path
                       (-> (io/file selected-path)
                           .getParentFile
                           .getCanonicalPath))]
    (get-relative-path project-path selected-dir)))

(defn delete-file-recursively!
  "Deletes the given path and all empty parents unless they are in project-set."
  [project-set path]
  (let [file (io/file path)]
    (when (and (= 0 (count (.listFiles file)))
               (not (contains? project-set path)))
      (io! (.delete file))
      (->> file
           .getParentFile
           .getCanonicalPath
           (delete-file-recursively! project-set)))))

(defn format-project-name
  "Formats the given string as a valid project name."
  [name-str]
  (-> name-str
      clojure.string/lower-case
      (clojure.string/replace "_" "-")
      (clojure.string/replace #"[^a-z0-9-.]" "")))

(defn format-package-name
  "Formats the given string as a valid package name."
  [name-str]
  (-> name-str
      clojure.string/lower-case
      (clojure.string/replace "-" "_")
      (clojure.string/replace #"[^a-z0-9_.]" "")))

(defn is-project-path?
  "Determines if the given path contains a project.clj file."
  [^String path]
  (and path
       (.isDirectory (io/file path))
       (.exists (io/file path "project.clj"))))

(defn is-parent-path?
  "Determines if the given parent path is equal to or a parent of the child."
  [^String parent-path ^String child-path]
  (or (= parent-path child-path)
      (and parent-path
           child-path
           (.isDirectory (io/file parent-path))
           (.startsWith child-path (str parent-path File/separator)))))

(defn is-text-file?
  "Returns true if the file is of type text, false otherwise."
  [^File file]
  (-> (Files/probeContentType ^Path (.toPath file))
      (or "")
      (.startsWith "text")))

; objc

(defn get-objc-client
  []
  (some-> (try (Class/forName "ca.weblite.objc.Client")
            (catch Exception _))
          (.getMethod "getInstance" (into-array Class []))
          (.invoke nil (object-array []))))

(defn base64->nsdata
  [text]
  (some-> (get-objc-client)
          (.sendProxy "NSData" "data" (object-array []))
          (.send "initWithBase64Encoding:" (object-array [text]))))

(defn write-file-permission!
  [path]
  (some-> (get-objc-client)
          (.sendProxy "NSURL" "fileURLWithPath:" (object-array [path]))
          (.sendProxy "bookmarkDataWithOptions:includingResourceValuesForKeys:relativeToURL:error:"
            (object-array [nil nil nil nil]))
          (.sendString "base64Encoding" (object-array []))))

(defn read-file-permission!
  [text]
  (some-> (get-objc-client)
          (.sendProxy "NSURL" "URLByResolvingBookmarkData:options:relativeToURL:bookmarkDataIsStale:error:"
            (object-array [(base64->nsdata text) nil nil false nil]))
          (.send "startAccessingSecurityScopedResource" (object-array []))))

(defn read-file-permissions!
  []
  (doseq [[path text] (read-pref :permission-map)]
    (read-file-permission! text)))
