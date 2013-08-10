(ns nightcode.utils
  (:require [clojure.edn :as edn]
            [clojure.java.io :as java.io]
            [clojure.xml :as xml]
            [seesaw.core :as s])
  (:import [bsh.util JConsole]
           [clojure.lang LineNumberingPushbackReader]
           [com.camick WrapLayout]
           [java.util Locale]
           [java.util.prefs Preferences]))

; preferences

(def prefs (.node (Preferences/userRoot) "nightcode"))

(defn write-pref
  [k v]
  (.put prefs (name k) (pr-str v)))

(defn read-pref
  [k]
  (when-let [string (.get prefs (name k) nil)]
    (edn/read-string string)))

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

(defn get-version
  []
  (let [project-clj (->> (java.io/resource "project.clj")
                         slurp
                         read-string
                         (binding [*read-eval* false]))]
    (if (= (name (nth project-clj 1)) "nightcode")
      (nth project-clj 2)
      "beta")))

; ui

(def ui-root (atom nil))

(defn wrap-panel
  [& {:keys [items hgap vgap]}]
  (let [hgap (or hgap 0)
        vgap (or vgap 0)
        panel (s/abstract-panel (WrapLayout. WrapLayout/LEFT hgap vgap) {})]
    (doseq [item items]
      (s/add! panel item))
    panel))

(defn create-console
  []
  (JConsole.))

(defn get-console-input
  [console]
  (LineNumberingPushbackReader. (.getIn console)))

(defn get-console-output
  [console]
  (.getOut console))

(defn is-project-path?
  [path]
  (and path
       (.isDirectory (java.io/file path))
       (.exists (java.io/file path "project.clj"))))

(defn get-project-tree
  []
  (s/select @ui-root [:#project-tree]))

(defn get-selected-path
  []
  (-> (get-project-tree)
      .getSelectionPath
      tree-path-to-str))

(defn move-project-tree-selection
  [diff]
  (let [project-tree (get-project-tree)
        new-row (-> project-tree
                    .getSelectionRows
                    first
                    (or 0)
                    (+ diff))]
    (when (and (>= new-row 0) (< new-row (.getRowCount project-tree)))
      (.setSelectionRow project-tree new-row)))
  true)

(defn toggle-project-tree-selection
  []
  (let [project-tree (get-project-tree)]
    (when-let [path (.getSelectionPath project-tree)]
      (->> (not (.isExpanded project-tree path))
           (.setExpandedState project-tree path))))
  true)

(defn shut-down
  []
  (System/exit 0))
