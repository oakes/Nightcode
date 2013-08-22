(ns nightcode.ui
  (:require [clojure.java.io :as java.io]
            [nightcode.utils :as utils]
            [seesaw.core :as s])
  (:import [clojure.lang LineNumberingPushbackReader]
           [bsh.util JConsole]
           [com.camick WrapLayout]))

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

(defn get-project-tree
  []
  (s/select @ui-root [:#project-tree]))

(defn get-selected-path
  []
  (-> (get-project-tree)
      .getSelectionPath
      utils/tree-path-to-str))
