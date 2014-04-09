(ns nightcode.ui
  (:require [clojure.java.io :as io]
            [nightcode.utils :as utils]
            [seesaw.core :as s])
  (:import [clojure.lang LineNumberingPushbackReader]
           [com.camick WrapLayout]
           [java.awt Dimension FontMetrics]
           [java.io File FilenameFilter]
           [javax.swing JComponent JTree]
           [javax.swing.tree DefaultTreeModel]))

; create and retrieve widgets

(def root (atom nil))

(defn wrap-panel
  "Returns a panel based on FlowLayout that allows its contents to wrap."
  [& {:keys [items align hgap vgap id]}]
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
    (s/config! panel :id id)
    (doseq [item items]
      (s/add! panel item))
    panel))

(defn adjust-button!
  "Adjusts the given button to fit its contents."
  [^JComponent btn]
  (let [width (-> (.getFontMetrics btn (.getFont btn))
                  (.getStringBounds (.getText btn) (.getGraphics btn))
                  .getWidth
                  (+ 30))
        height (-> btn .getPreferredSize .getHeight)]
    (doto btn
      (.setPreferredSize (Dimension. width height)))))

(defn config!
  "Sets a widget's property if necessary."
  [pane id k v]
  (when-let [widget (s/select pane [id])]
    (when (not= v (s/config widget k))
      (s/config! widget k v)
      true)))

(defmacro button
  "Creates an adjusted button."
  [& body]
  `(adjust-button! (s/button ~@body)))

(defmacro toggle
  "Creates an adjusted toggle."
  [& body]
  `(adjust-button! (s/toggle ~@body)))

(defn get-io
  "Returns the Reader and Writer for the given console object."
  [console]
  [(LineNumberingPushbackReader. (.getIn console))
   (.getOut console)])

(defn get-io!
  "Creates a new Reader and Writer before returning them."
  [console]
  (.init console)
  (get-io console))

(defn get-project-tree
  "Returns the project tree."
  []
  (s/select @root [:#project-tree]))

(defn get-builder-pane
  "Returns the builder pane."
  []
  (s/select @root [:#builder-pane]))

(defn get-editor-pane
  "Returns the editor pane."
  []
  (s/select @root [:#editor-pane]))

; keep track of the projects/expansions/selection

(def tree-projects (atom #{}))
(def tree-expansions (atom #{}))
(def tree-selection (atom nil))

(defn get-project-path
  "Returns the project path that the given path is contained within."
  [^String path]
  (when path
    (when-let [file (io/file path)]
      (if (or (utils/project-path? (.getCanonicalPath file))
              (contains? @tree-projects (.getCanonicalPath file)))
        (.getCanonicalPath file)
        (when-let [parent-file (.getParentFile file)]
          (get-project-path (.getCanonicalPath parent-file)))))))

(defn get-project-root-path
  "Returns the root path that the selected path is contained within."
  []
  (when-let [^String path @tree-selection]
    (-> #(or (.startsWith path (str % File/separator)) (= path %))
        (filter @tree-projects)
        first)))

; data for the project tree

(def ^:dynamic *node-adjustment-types* [:logcat])

(defmulti adjust-nodes (fn [type _ _] type) :default nil)

(defmethod adjust-nodes nil [_ _ children] children)

(defn reduce-nodes
  "Runs the nodes through whatever `adjust-nodes` multi-methods are indicated in
*node-adjustment-types*"
  [parent children]
  (reduce #(adjust-nodes %2 parent %1) children *node-adjustment-types*))

(defn get-node
  "Returns a map describing an item with the given file object."
  [^File file]
  (let [path (.getCanonicalPath file)
        file-name (.getName file)]
    {:html (cond
             (utils/project-path? path) (str "<html><b><font color='gray'>"
                                             file-name
                                             "</font></b></html>"))
     :name file-name
     :file file}))

(defn get-nodes
  "Returns a vector of maps describing sibling items in the project tree."
  [node children]
  (->> (for [child children]
         (get-node child))
       (sort-by #(:name %))
       (reduce-nodes node)
       vec))

(defn file-node
  "Creates a DefaultMutableTreeNode object for the given map."
  [node]
  (let [children (->> (reify FilenameFilter
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
  "Creates a DefaultMutableTreeNode object for the given list of project paths."
  [project-vec]
  (proxy [javax.swing.tree.DefaultMutableTreeNode] []
    (getChildAt [i] (file-node (get-node (io/file (nth project-vec i)))))
    (getChildCount [] (count project-vec))))

; create and update the project tree

(defn sort-project-set
  "Sorts project set alphabetically."
  [project-set]
  (sort-by #(.getName (io/file %)) project-set))

(defn create-project-tree!
  "Creates a new project tree."
  []
  (-> (reset! tree-projects (utils/read-pref :project-set))
      sort-project-set
      vec
      root-node
      (DefaultTreeModel. false)))

(defn update-project-tree!
  "Updates the project tree, optionally with a new selection."
  ([]
    (some-> (get-project-tree)
            (update-project-tree! nil)))
  ([^String new-selection]
    (if-let [tree (get-project-tree)]
      (update-project-tree! tree new-selection)
      (reset! tree-selection new-selection)))
  ([^JTree tree ^String new-selection]
    ; put new data in the tree
    (.setModel tree (create-project-tree!))
    ; wipe out the in-memory expansions
    (reset! tree-expansions #{})
    ; get the expansion/selection and apply them to the tree
    (let [expansion-set (utils/read-pref :expansion-set)
          selection (or new-selection (utils/read-pref :selection))]
      (doseq [i (range) :while (< i (.getRowCount tree))]
        (let [tree-path (.getPathForRow tree i)
              str-path (utils/tree-path-to-str tree-path)]
          (when (or (contains? expansion-set str-path)
                    (utils/parent-path? str-path new-selection))
            (.expandPath tree tree-path)
            (swap! tree-expansions conj str-path))
          (when (= selection str-path)
            (.setSelectionPath tree tree-path)))))
    ; select the first project if there is nothing selected
    (when (nil? (.getSelectionPath tree))
      (.setSelectionRow tree 0))
    ; if the project tree is blank, reset atom so the buttons refresh
    (when (= 0 (count @tree-projects))
      (reset! tree-selection nil))))
