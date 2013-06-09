(ns nightcode.editors
  (:use [seesaw.core :only [vertical-panel
                            horizontal-panel
                            add!
                            show-card!
                            remove!
                            request-focus!
                            select
                            button]]
        [clojure.java.io :only [file
                                resource
                                input-stream
                                reader]]
        [nightcode.utils :only [ui-root]])
  (:import org.fife.ui.rsyntaxtextarea.SyntaxConstants))

(def editors (atom {}))
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
            text-area-group (vertical-panel
                              :items [(horizontal-panel
                                        :items [(button :text "Save")
                                                (button :text "Move/Rename")
                                                (button :text "Undo")
                                                (button :text "Redo")
                                                :fill-h])
                                      text-area-scroll])]
        (.read text-area (reader (file path)) nil)
        (.setSyntaxEditingStyle text-area (get-syntax-style path))
        (-> (resource "dark.xml")
            (input-stream)
            (org.fife.ui.rsyntaxtextarea.Theme/load)
            (.apply text-area))
        (swap! editors assoc path text-area-group)
        (.add editor-pane text-area-group path)))
    ; display the correct card and give it focus
    (show-card! editor-pane (if (contains? @editors path) path :default-card))
    (when (contains? @editors path)
      (->> [:<org.fife.ui.rsyntaxtextarea.RSyntaxTextArea>]
           (select (get @editors path))
           first
           request-focus!))))
