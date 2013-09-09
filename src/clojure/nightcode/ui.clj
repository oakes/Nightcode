(ns nightcode.ui
  (:require [clojure.java.io :as java.io]
            [nightcode.utils :as utils]
            [seesaw.core :as s])
  (:import [clojure.lang LineNumberingPushbackReader]
           [bsh.util JConsole]
           [com.camick WrapLayout]))

(def ui-root (atom nil))

(def tree-projects (atom #{}))
(def tree-expansions (atom #{}))
(def tree-selection (atom nil))

(defn wrap-panel
  [& {:keys [items align hgap vgap]}]
  (let [align (case align
                :left WrapLayout/LEFT
                :center WrapLayout/CENTER
                :right WrapLayout/RIGHT
                :leading WrapLayout/LEADING
                :trailing WrapLayout/TRAILING
                WrapLayout/LEFT)
        hgap (or hgap 0)
        vgap (or vgap 0)
        panel (s/abstract-panel (WrapLayout. align hgap vgap) {})]
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

(defn get-project-tree
  []
  (s/select @ui-root [:#project-tree]))

(defn get-selected-path
  []
  (-> (get-project-tree)
      .getSelectionPath
      utils/tree-path-to-str))

(defn get-project-path
  [path]
  (when path
    (when-let [file (java.io/file path)]
      (if (or (utils/is-project-path? (.getCanonicalPath file))
              (contains? @tree-projects (.getCanonicalPath file)))
        (.getCanonicalPath file)
        (when-let [parent-file (.getParentFile file)]
          (get-project-path (.getCanonicalPath parent-file)))))))

(defn get-project-root-path
  []
  (-> #(.startsWith (get-selected-path) %)
      (filter @tree-projects)
      first))
