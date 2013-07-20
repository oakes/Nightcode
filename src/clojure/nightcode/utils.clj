(ns nightcode.utils
  (:require [clojure.java.io :as java.io]
            [seesaw.core :as s])
  (:import [java.awt Color]
           [java.util.prefs Preferences]
           [net.java.balloontip BalloonTip]
           [net.java.balloontip.positioners CenteredPositioner]
           [net.java.balloontip.styles ToolTipBalloonStyle]))

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
  [name-str project-type]
  (if (and project-type (>= (.indexOf (name project-type) "java") 0))
    (-> name-str
        (clojure.string/replace "-" "_")
        (clojure.string/replace #"[^a-zA-Z0-9_.]" ""))
    (-> name-str
        clojure.string/lower-case
        (clojure.string/replace "_" "-")
        (clojure.string/replace #"[^a-z0-9-.]" ""))))

(defn create-hint
  [btn text]
  (when text
    (let [style (ToolTipBalloonStyle. Color/DARK_GRAY Color/DARK_GRAY)
          positioner (CenteredPositioner. 0)]
      (doto (BalloonTip. btn text style false)
        (.setPositioner positioner)
        (.setVisible false)))))

(defn toggle-hints
  [target show?]
  (doseq [hint (s/select target [:BalloonTip])]
    (if show? (s/show! hint) (s/hide! hint))))

(defn create-hints
  [target]
  (doseq [btn (s/select target [:JButton])]
    (create-hint btn
                 (case (s/id-of btn)
                   :new-project-button "P"
                   :new-file-button "N"
                   :rename-file-button "M"
                   :import-button "O"
                   :remove-button "I"
                   :run-button "R"
                   :run-repl-button "E"
                   :build-button "B"
                   :test-button "T"
                   :clean-button "L"
                   :stop-button "Q"
                   :save-button "S"
                   :undo-button "Z"
                   :redo-button "Y"
                   nil))))
