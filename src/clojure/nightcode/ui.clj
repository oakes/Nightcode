(ns nightcode.ui
  (:require [clojure.java.io :as java.io]
            [nightcode.lein :as lein]
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

(defn get-node
  [file]
  (let [path (.getCanonicalPath file)
        file-name (.getName file)]
    {:html (cond
             (utils/is-project-path? path) (str "<html><b><font color='gray'>"
                                                file-name
                                                "</font></b></html>"))
     :name file-name
     :file file}))

(defn get-nodes
  [node children]
  (->> (for [child children]
         (get-node child))
       (sort-by #(:name %))
       (cons (when (and (:file node)
                        (-> (.getCanonicalPath (:file node))
                            lein/is-android-project?))
               {:html "<html><b><font color='green'>LogCat</font></b></html>"
                :name "LogCat"
                :file (java.io/file (:file node) "*LogCat*")}))
       (remove nil?)
       vec))

(defn file-node
  [node]
  (let [children (->> (reify java.io.FilenameFilter
                        (accept [this dir filename]
                          (not (.startsWith filename "."))))
                      (.listFiles (:file node))
                      (get-nodes node)
                      delay)]
    (proxy [javax.swing.tree.DefaultMutableTreeNode] [node]
      (getChildAt [i] (file-node (get @children i)))
      (getChildCount [] (count @children))
      (isLeaf [] (or (nil? (:file node))
                     (not (.isDirectory (:file node)))))
      (toString [] (or (:html node) (:name node))))))

(defn root-node
  [project-vec]
  (proxy [javax.swing.tree.DefaultMutableTreeNode] []
    (getChildAt [i] (file-node (get-node (java.io/file (nth project-vec i)))))
    (getChildCount [] (count project-vec))))

(defn create-project-tree
  []
  (reset! tree-projects
          (-> #(.getName (java.io/file %))
              (sort-by (utils/read-pref :project-set))
              (set)))
  (-> @tree-projects
      vec
      root-node
      (javax.swing.tree.DefaultTreeModel. false)))

(defn update-project-tree
  ([]
   (update-project-tree (get-project-tree) nil))
  ([new-selection]
   (update-project-tree (get-project-tree) new-selection))
  ([tree new-selection]
   ; put new data in the tree
   (.setModel tree (create-project-tree))
   ; wipe out the in-memory expansion/selection
   (reset! tree-expansions #{})
   (reset! tree-selection nil)
   ; get the expansion/selection and apply them to the tree
   (let [expansion-set (utils/read-pref :expansion-set)
         selection (or new-selection (utils/read-pref :selection))]
     (doseq [i (range) :while (< i (.getRowCount tree))]
       (let [tree-path (.getPathForRow tree i)
             str-path (utils/tree-path-to-str tree-path)]
         (when (or (contains? expansion-set str-path)
                   (and new-selection (.startsWith new-selection str-path)))
           (.expandPath tree tree-path)
           (swap! tree-expansions conj str-path))
         (when (= selection str-path)
           (.setSelectionPath tree tree-path)))))
   ; select the first project if there is nothing selected
   (when (nil? @tree-selection)
     (.setSelectionRow tree 0))))
