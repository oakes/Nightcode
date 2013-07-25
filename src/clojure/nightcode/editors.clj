(ns nightcode.editors
  (:require [clojure.java.io :as java.io]
            [nightcode.lein :as lein]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.utils :as utils]
            [seesaw.core :as s])
  (:import [javax.swing.event DocumentListener]
           [org.fife.ui.rsyntaxtextarea
            FileLocation SyntaxConstants TextEditorPane Theme]
           [org.fife.ui.rtextarea RTextScrollPane]))

; keep track of the editors

(def editors (atom {}))

(defn get-editor
  [path]
  (when (contains? @editors path)
    (->> [:<org.fife.ui.rsyntaxtextarea.TextEditorPane>]
         (s/select (get @editors path))
         first)))

(defn is-unsaved?
  [path]
  (when-let [editor (get-editor path)]
    (.isDirty editor)))

; actions for editor buttons

(defn save-file
  [e]
  (let [project-tree (s/select (s/to-root e) [:#project-tree])
        selected-path (-> (.getSelectionPath project-tree)
                          utils/tree-path-to-str)
        editor (get-editor selected-path)]
    (.save editor)
    (s/request-focus! editor)
    (s/config! (s/select (get @editors selected-path) [:#save-button])
               :enabled? false)))

; create and show editors for each file

(def ^:const styles {"clj" SyntaxConstants/SYNTAX_STYLE_CLOJURE
                     "cljs" SyntaxConstants/SYNTAX_STYLE_CLOJURE
                     "js" SyntaxConstants/SYNTAX_STYLE_JAVASCRIPT
                     "java" SyntaxConstants/SYNTAX_STYLE_JAVA
                     "xml" SyntaxConstants/SYNTAX_STYLE_XML
                     "html" SyntaxConstants/SYNTAX_STYLE_HTML
                     "htm" SyntaxConstants/SYNTAX_STYLE_HTML
                     "css" SyntaxConstants/SYNTAX_STYLE_CSS
                     "json" SyntaxConstants/SYNTAX_STYLE_NONE
                     "md" SyntaxConstants/SYNTAX_STYLE_NONE
                     "txt" SyntaxConstants/SYNTAX_STYLE_NONE})

(defn get-extension
  [path]
  (->> (.lastIndexOf path ".")
       (+ 1)
       (subs path)
       clojure.string/lower-case))

(defn get-syntax-style
  [path]
  (or (get styles (get-extension path))
      SyntaxConstants/SYNTAX_STYLE_NONE))

(defn create-editor
  [path]
  (when (and (.isFile (java.io/file path))
             (contains? styles (get-extension path)))
    (let [text-area (TextEditorPane.)
          text-area-scroll (RTextScrollPane. text-area)
          text-group (s/vertical-panel
                       :items [(s/horizontal-panel
                                 :items [(s/button :id :save-button
                                                   :text "Save"
                                                   :listen [:action save-file]
                                                   :enabled? false)
                                         (s/button :id :undo-button
                                                   :text "Undo")
                                         (s/button :id :redo-button
                                                   :text "Redo")
                                         :fill-h])
                               text-area-scroll])]
      (shortcuts/create-hints text-group)
      (.load text-area (FileLocation/create path) "UTF-8")
      (.discardAllEdits text-area)
      (.setAntiAliasingEnabled text-area true)
      (.addDocumentListener (.getDocument text-area)
                            (reify DocumentListener
                              (changedUpdate [this e])
                              (insertUpdate [this e]
                                (-> (s/select text-group [:#save-button])
                                    (s/config! :enabled? true)))
                              (removeUpdate [this e]
                                (-> (s/select text-group [:#save-button])
                                    (s/config! :enabled? true)))))
      (.setSyntaxEditingStyle text-area (get-syntax-style path))
      (-> (java.io/resource "dark.xml")
          java.io/input-stream
          Theme/load
          (.apply text-area))
      text-group)))

(defn create-logcat
  [path]
  (when (= (.getName (java.io/file path)) "*LogCat*")
    (let [console (utils/create-console)
          process (atom nil)
          thread (atom nil)
          in (utils/get-console-input console)
          out (utils/get-console-output console)]
      (lein/run-logcat process thread in out (.getParent (java.io/file path)))
      console)))

(defn show-editor
  [path]
  (let [editor-pane (s/select @utils/ui-root [:#editor-pane])]
    ; create new editor if necessary
    (when-not (contains? @editors path)
      (when-let [view (or (create-editor path)
                          (create-logcat path))]
        (swap! editors assoc path view)
        (.add editor-pane view path)))
    ; display the correct card
    (s/show-card! editor-pane (if (contains? @editors path) path :default-card))
    ; give the editor focus if it exists
    (when-let [editor (get-editor path)]
      (s/request-focus! editor))))
