(ns nightcode.git
  (:require [clojure.java.io :as io]
            [nightcode.editors :as editors]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [seesaw.core :as s])
  (:import [javax.swing.event HyperlinkEvent$EventType TreeSelectionListener]
           [javax.swing.text.html HTMLEditorKit StyleSheet]
           [javax.swing.tree DefaultMutableTreeNode DefaultTreeModel
            TreeSelectionModel]
           [org.eclipse.jgit.api Git]
           [org.eclipse.jgit.internal.storage.file FileRepository]))

(def ^:const git-name "*Git*")
(def ^:const max-commits 50)

(defn update-content!
  [content commit]
  (doto content
    (.setText "")
    (.setCaretPosition 0)))

(defn commit-node
  [commit]
  (proxy [DefaultMutableTreeNode] [commit]
    (toString [] (.getShortMessage commit))))

(defn root-node
  [f]
  (let [repo (FileRepository. f)
        git (Git. repo)
        commit-objects (-> git .log (.setMaxCount max-commits) .call .iterator)
        commits (iterator-seq commit-objects)]
    (proxy [DefaultMutableTreeNode] []
      (getChildAt [i] (commit-node (nth commits i)))
      (getChildCount [] (count commits)))))

(defn create-sidebar
  [content f]
  (doto (s/tree :id :git-sidebar)
    (.setRootVisible false)
    (.setShowsRootHandles false)
    (.setModel (DefaultTreeModel. (root-node f)))
    (.addTreeSelectionListener
      (reify TreeSelectionListener
        (valueChanged [this e]
          (->> (some-> e .getPath .getLastPathComponent .getUserObject)
               (update-content! content)))))
    (-> .getSelectionModel
        (.setSelectionMode TreeSelectionModel/SINGLE_TREE_SELECTION))
    (.setSelectionRow 0)))

(defn create-content
  []
  (let [css (doto (StyleSheet.) (.importStyleSheet (io/resource "git.css")))
        kit (doto (HTMLEditorKit.) (.setStyleSheet css))]
    (doto (s/editor-pane :id :git-content
                         :editable? false
                         :content-type "text/html")
      (.setEditorKit kit))))

(defn git-file
  [path]
  (io/file path ".git"))

(defn git-project?
  [path]
  (.exists (git-file path)))

(def ^:dynamic *widgets* [:pull :push :configure])

(defn create-actions
  []
  {:pull (fn [& _])
   :push (fn [& _])
   :configure (fn [& _])})

(defn create-widgets
  [actions]
  {:pull (ui/button :id :pull
                    :text (utils/get-string :pull)
                    :listen [:action (:pull actions)])
   :push (ui/button :id :push
                    :text (utils/get-string :push)
                    :listen [:action (:push actions)])
   :configure (ui/button :id :configure
                         :text (utils/get-string :configure)
                         :listen [:action (:configure actions)])})

(defmethod editors/create-editor :git [_ path]
  (when (= (.getName (io/file path)) git-name)
    (let [; get the path of the parent directory
          path (-> path io/file .getParentFile .getCanonicalPath)
          ; create the pane
          content (create-content)
          sidebar (create-sidebar content (git-file path))
          git-pane (s/border-panel
                     :west (s/scrollable sidebar
                                         :size [200 :by 0]
                                         :hscroll :never)
                     :center (s/scrollable content))
          ; create the actions and widgets
          actions (create-actions)
          widgets (create-widgets actions)
          ; create the bar that holds the widgets
          widget-bar (ui/wrap-panel :items (map #(get widgets % %) *widgets*))]
      ; add the widget bar if necessary
      (when (> (count *widgets*) 0)
        (doto git-pane
          (s/config! :north widget-bar)
          shortcuts/create-hints!
          (shortcuts/create-mappings! actions)))
      ; return a map describing the view
      {:view git-pane
       :close-fn! (fn [])
       :should-remove-fn #(not (git-project? path))
       :italicize-fn (fn [] false)})))

(defmethod ui/adjust-nodes :git [_ parent children]
  (if (some-> (:file parent) .getCanonicalPath git-project?)
    (cons {:html "<html><b><font color='orange'>Git</font></b></html>"
           :name "Git"
           :file (io/file (:file parent) git-name)}
          children)
    children))
