(ns nightcode.git
  (:require [clojure.java.io :as io]
            [clojure.string :as string]
            [hiccup.core :as h]
            [hiccup.util :as h-util]
            [nightcode.editors :as editors]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [seesaw.core :as s])
  (:import [java.io ByteArrayOutputStream]
           [javax.swing.event HyperlinkEvent$EventType TreeSelectionListener]
           [javax.swing.text.html HTMLEditorKit StyleSheet]
           [javax.swing.tree DefaultMutableTreeNode DefaultTreeModel
            TreeSelectionModel]
           [org.eclipse.jgit.api Git]
           [org.eclipse.jgit.diff DiffEntry DiffFormatter]
           [org.eclipse.jgit.internal.storage.file FileRepository]
           [org.eclipse.jgit.revwalk RevCommit]))

(def ^:const git-name "*Git*")
(def ^:const max-commits 50)

(defn format-diff!
  [^ByteArrayOutputStream out ^DiffFormatter df ^DiffEntry diff]
  (.format df diff)
  (let [s (.toString out "UTF-8")]
    (.reset out)
    s))

(defn add-bold
  [s]
  [:pre {:style "font-family: monospace; font-weight: bold;"} s])

(defn add-color
  [s]
  (cond
    (.startsWith s "+")
    [:pre {:style (format "font-family: monospace; color: %s;"
                          (ui/green-html-color))} s]
    
    (.startsWith s "-")
    [:pre {:style (format "font-family: monospace; color: %s;"
                          (ui/red-html-color))} s]
    
    :else
    [:pre {:style "font-family: monospace"} s]))

(defn add-formatting
  [lines]
  (let [[headers code] (split-at 4 lines)]
    (concat (map add-bold headers)
            (map add-color code)
            [[:br] [:br]])))

(defn create-html
  [^Git git ^RevCommit commit]
  (h/html
    [:html
     [:body {:style (format "color: %s" (ui/html-color))}
      [:div {:class "head"} (.getFullMessage commit)]
      (let [out (ByteArrayOutputStream.)
            df (doto (DiffFormatter. out)
                 (.setRepository (.getRepository git)))
            old-tree (.getTree (.getParent commit 0))
            new-tree (.getTree commit)]
        (for [diff (.scan df old-tree new-tree)]
          (->> (format-diff! out df diff)
               string/split-lines
               (map h-util/escape-html)
               (add-formatting))))]]))

(defn update-content!
  [content ^Git git ^RevCommit commit]
  (doto content
    (.setText (create-html git commit))
    (.setCaretPosition 0)))

(defn commit-node
  [^RevCommit commit]
  (proxy [DefaultMutableTreeNode] [commit]
    (toString [] (.getShortMessage commit))))

(defn root-node
  [commits]
  (proxy [DefaultMutableTreeNode] []
    (getChildAt [i] (commit-node (nth commits i)))
    (getChildCount [] (count commits))))

(defn create-sidebar
  [content f]
  (let [repo (FileRepository. f)
        git (Git. repo)
        commit-objects (-> git .log (.setMaxCount max-commits) .call .iterator)
        commits (iterator-seq commit-objects)]
    (doto (s/tree :id :git-sidebar)
      (.setRootVisible false)
      (.setShowsRootHandles false)
      (.setModel (DefaultTreeModel. (root-node commits)))
      (.addTreeSelectionListener
        (reify TreeSelectionListener
          (valueChanged [this e]
            (->> (some-> e .getPath .getLastPathComponent .getUserObject)
                 (update-content! content git)))))
      (-> .getSelectionModel
          (.setSelectionMode TreeSelectionModel/SINGLE_TREE_SELECTION))
      (.setSelectionRow 0))))

(defn create-content
  []
  (let [css (doto (StyleSheet.) (.importStyleSheet (io/resource "git.css")))
        kit (doto (HTMLEditorKit.) (.setStyleSheet css))]
    (doto (s/editor-pane :id :git-content
                         :editable? false
                         :content-type "text/html")
      (.setEditorKit kit)
      (.setBackground (ui/background-color)))))

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
