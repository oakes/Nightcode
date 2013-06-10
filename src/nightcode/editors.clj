(ns nightcode.editors
  (:use [seesaw.core :only [vertical-panel
                            horizontal-panel
                            add!
                            show-card!
                            remove!
                            config!
                            request-focus!
                            select
                            button
                            to-root]]
        [clojure.java.io :only [file
                                resource
                                input-stream
                                reader
                                writer]]
        [nightcode.utils :only [ui-root
                                tree-path-to-str]])
  (:import org.fife.ui.rsyntaxtextarea.SyntaxConstants))

; keep track of the editors

(def editors (atom {}))

(defn get-editor
  [path]
  (when (contains? @editors path)
    (->> [:<org.fife.ui.rsyntaxtextarea.RSyntaxTextArea>]
         (select (get @editors path))
         first)))

; actions for editor buttons

(defn save-file
  [e]
  (let [project-tree (select (to-root e) [:#project-tree])
        selected-path (-> (.getSelectionPath project-tree)
                          tree-path-to-str)
        editor (get-editor selected-path)]
    (with-open [w (writer (file selected-path))]
      (.write editor w))
    (request-focus! editor)
    (config! (select (get @editors selected-path) [:#save-button])
             :enabled? false)))

; create and show editors for each file

(def ^:const styles {"clj" SyntaxConstants/SYNTAX_STYLE_CLOJURE
                     "cljs" SyntaxConstants/SYNTAX_STYLE_CLOJURE
                     "js" SyntaxConstants/SYNTAX_STYLE_JAVASCRIPT
                     "java" SyntaxConstants/SYNTAX_STYLE_JAVA})

(defn get-syntax-style
  [path]
  (let [ext (->> (.lastIndexOf path ".")
                 (+ 1)
                 (subs path))]
    (if (contains? styles ext)
      (get styles ext)
      SyntaxConstants/SYNTAX_STYLE_NONE)))

(defn show-editor
  [path]
  (let [editor-pane (select @ui-root [:#editor-pane])]
    ; create new editor if necessary
    (when (and (.isFile (file path))
               (not (contains? @editors path)))
      (let [text-area (org.fife.ui.rsyntaxtextarea.RSyntaxTextArea.)
            text-area-scroll (org.fife.ui.rtextarea.RTextScrollPane. text-area)
            text-group (vertical-panel
                         :items [(horizontal-panel
                                   :items [(button :id :save-button
                                                   :text "Save"
                                                   :listen [:action save-file]
                                                   :enabled? false)
                                           (button :text "Undo")
                                           (button :text "Redo")
                                           :fill-h])
                                 text-area-scroll])]
        (.read text-area (reader (file path)) nil)
        (.discardAllEdits text-area)
        (.setAntiAliasingEnabled text-area true)
        (.addDocumentListener (.getDocument text-area)
                              (reify javax.swing.event.DocumentListener
                                (changedUpdate [this e])
                                (insertUpdate [this e]
                                  (config! (select text-group [:#save-button])
                                           :enabled? true))
                                (removeUpdate [this e]
                                  (config! (select text-group [:#save-button])
                                           :enabled? true))))
        (.setSyntaxEditingStyle text-area (get-syntax-style path))
        (-> (resource "dark.xml")
            (input-stream)
            (org.fife.ui.rsyntaxtextarea.Theme/load)
            (.apply text-area))
        (swap! editors assoc path text-group)
        (.add editor-pane text-group path)))
    ; display the correct card and give it focus
    (show-card! editor-pane (if (contains? @editors path) path :default-card))
    (when-let [editor (get-editor path)]
      (request-focus! editor))))
