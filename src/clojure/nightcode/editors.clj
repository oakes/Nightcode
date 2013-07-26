(ns nightcode.editors
  (:require [clojure.java.io :as java.io]
            [nightcode.lein :as lein]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.utils :as utils]
            [seesaw.color :as color]
            [seesaw.core :as s])
  (:import [com.camick TextPrompt]
           [javax.swing.event DocumentListener]
           [org.fife.ui.rsyntaxtextarea
            FileLocation SyntaxConstants TextEditorPane Theme]
           [org.fife.ui.rtextarea RTextScrollPane SearchContext SearchEngine]))

; keep track of the editors

(def editors (atom {}))

(defn get-editor
  [path]
  (when (contains? @editors path)
    (->> [:<org.fife.ui.rsyntaxtextarea.TextEditorPane>]
         (s/select (get @editors path))
         first)))

(defn get-selected-editor
  []
  (-> (s/select @utils/ui-root [:#project-tree])
      .getSelectionPath
      utils/tree-path-to-str
      get-editor))

(defn get-selected-editor-pane
  []
  (->> (s/select @utils/ui-root [:#project-tree])
       .getSelectionPath
       utils/tree-path-to-str
       (get @editors)))

(defn is-unsaved?
  [path]
  (when-let [editor (get-editor path)]
    (.isDirty editor)))

; actions for editor buttons

(defn save-file
  [e]
  (when-let [editor (get-selected-editor)]
    (.save editor)
    (s/request-focus! editor)
    (s/config! (s/select (get-selected-editor-pane) [:#save-button])
               :enabled? false)))

(defn focus-on-find
  [e]
  (when-let [pane (get-selected-editor-pane)]
    (doto (s/select pane [:#find-field])
      s/request-focus!
      .selectAll)))

(defn search
  [e]
  (when-let [editor (get-selected-editor)]
    (let [is-enter-key? (= (.getKeyCode e) 10)
          context (SearchContext. (s/text e))]
      (when-not is-enter-key?
        (.setCaretPosition editor 0))
      (when (and is-enter-key? (.isShiftDown e))
        (.setSearchForward context false))
      (if (or (SearchEngine/find editor context)
              (= (count (s/text e)) 0))
        (s/config! e :background nil)
        (s/config! e :background (color/color :red))))))

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
          text-group (s/border-panel
                       :north (s/flow-panel
                                :items [(s/button :id :save-button
                                                  :text
                                                  (utils/get-string :save)
                                                  :listen [:action save-file]
                                                  :enabled? false)
                                        (s/button :id :undo-button
                                                  :text
                                                  (utils/get-string :undo))
                                        (s/button :id :redo-button
                                                  :text
                                                  (utils/get-string :redo))
                                        (s/text :id :find-field
                                                :columns 10
                                                :listen [:key-released search])]
                                :align :left
                                :hgap 0
                                :vgap 0)
                       :center text-area-scroll)]
      (doto (TextPrompt. (utils/get-string :find)
                         (s/select text-group [:#find-field]))
        (.changeAlpha 0.5))
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
