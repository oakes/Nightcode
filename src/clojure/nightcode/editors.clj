(ns nightcode.editors
  (:require [clojure.java.io :as java.io]
            [nightcode.lein :as lein]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.utils :as utils]
            [paredit-widget.core :as paredit]
            [seesaw.color :as color]
            [seesaw.core :as s])
  (:import [com.camick TextPrompt]
           [javax.swing.event DocumentListener]
           [org.fife.ui.rsyntaxtextarea
            FileLocation SyntaxConstants TextEditorPane Theme]
           [org.fife.ui.rtextarea RTextScrollPane SearchContext SearchEngine]))

; open editors

(def editors (atom {}))

(defn get-editor
  [path]
  (when (contains? @editors path)
    (->> [:<org.fife.ui.rsyntaxtextarea.TextEditorPane>]
         (s/select (get @editors path))
         first)))

(defn get-selected-editor
  []
  (get-editor (utils/get-selected-path)))

(defn get-selected-editor-pane
  []
  (get @editors (utils/get-selected-path)))

(defn is-unsaved?
  [path]
  (when-let [editor (get-editor path)]
    (.isDirty editor)))

(defn get-editor-content
  []
  (when-let [editor (get-selected-editor)]
    (.getText editor)))

; actions for editor buttons

(defn update-buttons
  [pane editor]
  (-> (s/select pane [:#save-button])
      (s/config! :enabled? (.isDirty editor)))
  (-> (s/select pane [:#undo-button])
      (s/config! :enabled? (.canUndo editor)))
  (-> (s/select pane [:#redo-button])
      (s/config! :enabled? (.canRedo editor))))

(defn save-file
  [e]
  (when-let [editor (get-selected-editor)]
    (with-open [w (java.io/writer (java.io/file (utils/get-selected-path)))]
      (.write editor w))
    (.setDirty editor false)
    (s/request-focus! editor)
    (update-buttons (get-selected-editor-pane) editor)))

(defn undo-file
  [e]
  (when-let [editor (get-selected-editor)]
    (.undoLastAction editor)
    (update-buttons (get-selected-editor-pane) editor)))

(defn redo-file
  [e]
  (when-let [editor (get-selected-editor)]
    (.redoLastAction editor)
    (update-buttons (get-selected-editor-pane) editor)))

(defn set-font-size
  [size-fn]
  (when-let [editor (get-selected-editor)]
    (let [font (.getFont editor)
          size (.getSize font)
          new-font (.deriveFont font (float (size-fn size)))]
      (.setFont editor new-font))))

(defn increase-font-size
  [e]
  (set-font-size inc))

(defn decrease-font-size
  [e]
  (set-font-size dec))

(defn focus-on-find
  [e]
  (when-let [pane (get-selected-editor-pane)]
    (doto (s/select pane [:#find-field])
      s/request-focus!
      .selectAll)))

(defn close-file
  [e])

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
    (let [text-area (paredit/paredit-widget (TextEditorPane.))
          text-area-scroll (RTextScrollPane. text-area)
          btn-group (utils/wrap-panel
                      :items [(s/button :id :save-button
                                        :text
                                        (utils/get-string :save)
                                        :focusable? false
                                        :listen [:action save-file])
                              (s/button :id :undo-button
                                        :text
                                        (utils/get-string :undo)
                                        :focusable? false
                                        :listen [:action undo-file])
                              (s/button :id :redo-button
                                        :text
                                        (utils/get-string :redo)
                                        :focusable? false
                                        :listen [:action redo-file])
                              (s/button :id :font-enc-button
                                        :text
                                        (utils/get-string :font-enc)
                                        :focusable? false
                                        :listen [:action increase-font-size])
                              (s/button :id :font-dec-button
                                        :text
                                        (utils/get-string :font-dec)
                                        :focusable? false
                                        :listen [:action decrease-font-size])
                              (s/text :id :find-field
                                      :columns 10
                                      :listen [:key-released search])])
          text-group (s/border-panel
                       :north btn-group
                       :center text-area-scroll)]
      (shortcuts/create-mappings text-group
                                 {:save-button save-file
                                  :undo-button undo-file
                                  :redo-button redo-file
                                  :find-field focus-on-find
                                  :font-enc-button increase-font-size
                                  :font-dec-button decrease-font-size})
      (shortcuts/create-hints text-group)
      (update-buttons text-group text-area)
      (doto (TextPrompt. (utils/get-string :find)
                         (s/select text-group [:#find-field]))
        (.changeAlpha 0.5))
      (.load text-area (FileLocation/create path) nil)
      (.discardAllEdits text-area)
      (.setAntiAliasingEnabled text-area true)
      (s/listen text-area
                :key-released
                (fn [e] (update-buttons text-group text-area)))
      (.addDocumentListener (.getDocument text-area)
                            (reify DocumentListener
                              (changedUpdate [this e]
                                (update-buttons text-group text-area))
                              (insertUpdate [this e]
                                (update-buttons text-group text-area))
                              (removeUpdate [this e]
                                (update-buttons text-group text-area))))
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
          out (utils/get-console-output console)
          toggle-btn (s/button :id :toggle-logcat-button
                               :text (utils/get-string :start))
          btn-group (s/horizontal-panel :items [toggle-btn])
          start (fn []
                  (->> (.getParent (java.io/file path))
                       (lein/run-logcat process thread in out))
                  (s/config! toggle-btn :text (utils/get-string :stop)))
          stop (fn []
                 (lein/stop-process process)
                 (lein/stop-thread thread)
                 (s/config! toggle-btn :text (utils/get-string :start)))
          toggle (fn [e]
                   (if (nil? @process) (start) (stop)))]
      (s/listen toggle-btn :action toggle)
      (shortcuts/create-mappings btn-group {:toggle-logcat-button toggle})
      (shortcuts/create-hints btn-group)
      (s/border-panel :north btn-group
                      :center console))))

(defn show-editor
  [path]
  (let [editor-pane (s/select @utils/ui-root [:#editor-pane])]
    ; create new editor if necessary
    (when (and path (not (contains? @editors path)))
      (when-let [view (or (create-editor path)
                          (create-logcat path))]
        (swap! editors assoc path view)
        (.add editor-pane view path)))
    ; display the correct card
    (s/show-card! editor-pane (if (contains? @editors path) path :default-card))
    ; give the editor focus if it exists
    (when-let [editor (get-editor path)]
      (s/request-focus! editor))))
