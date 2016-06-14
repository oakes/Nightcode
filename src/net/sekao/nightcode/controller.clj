(ns net.sekao.nightcode.controller
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [net.sekao.nightcode.boot :as b]
            [net.sekao.nightcode.editors :as e]
            [net.sekao.nightcode.projects :as p]
            [net.sekao.nightcode.state :refer [pref-state runtime-state]]
            [net.sekao.nightcode.utils :as u])
  (:import [javafx.event ActionEvent]
           [javafx.scene.control Alert Alert$AlertType ButtonType TextInputDialog]
           [javafx.stage DirectoryChooser FileChooser StageStyle Window Modality]
           [javafx.application Platform]
           [javafx.scene Scene]
           [javafx.scene.input KeyEvent KeyCode])
  (:gen-class
   :methods [[onNewConsoleProject [javafx.event.ActionEvent] void]
             [onImport [javafx.event.ActionEvent] void]
             [onRename [javafx.event.ActionEvent] void]
             [onRemove [javafx.event.ActionEvent] void]
             [onUp [javafx.event.ActionEvent] void]
             [onSave [javafx.event.ActionEvent] void]
             [onUndo [javafx.event.ActionEvent] void]
             [onRedo [javafx.event.ActionEvent] void]
             [onInstaRepl [javafx.event.ActionEvent] void]
             [find [javafx.scene.input.KeyEvent] void]
             [onClose [javafx.event.ActionEvent] void]]))

; new project

(defn show-start-menu! [^Scene scene]
  (some-> (.lookup scene "#start") .show))

(defn new-project! [^Scene scene project-type]
  (let [chooser (doto (FileChooser.)
                  (.setTitle "New Project"))
        project-tree (.lookup scene "#project_tree")]
    (when-let [file (.showSaveDialog chooser (.getWindow scene))]
      (let [dialog (doto (Alert. Alert$AlertType/INFORMATION)
                     (.setHeaderText "Creating project...")
                     (.setGraphic nil)
                     (.initOwner (.getWindow scene))
                     (.initStyle StageStyle/UNDECORATED))]
        (-> dialog .getDialogPane (.lookupButton ButtonType/OK) (.setDisable true))
        (.show dialog)
        (future
          (try
            (b/new-project! file (name project-type))
            (catch Exception e (.printStackTrace e)))
          (Platform/runLater
            (fn []
              (.hide dialog)
              (swap! pref-state update :project-set conj (.getCanonicalPath file))
              (p/update-project-tree! pref-state project-tree))))))))

(defn -onNewConsoleProject [this ^ActionEvent event]
  (-> event .getSource .getParentPopup .getOwnerWindow .getScene (new-project! :app)))

; import

(defn import! [^Scene scene]
  (let [chooser (doto (DirectoryChooser.)
                  (.setTitle "Import"))
        project-tree (.lookup scene "#project_tree")]
    (when-let [file (.showDialog chooser (.getWindow scene))]
      (let [path (.getCanonicalPath file)]
        (swap! pref-state update :project-set conj path)
        (p/update-project-tree! pref-state project-tree path)))))

(defn -onImport [this ^ActionEvent event]
  (-> event .getSource .getScene import!))

; rename

(defn rename! [^Scene scene]
  (let [dialog (doto (TextInputDialog.)
                 (.setTitle "Rename")
                 (.setHeaderText "Enter a path relative to the project root.")
                 (.setGraphic nil)
                 (.initOwner (.getWindow scene))
                 (.initModality Modality/WINDOW_MODAL))
        project-path (u/get-project-root-path @pref-state)
        selected-path (:selection @pref-state)
        relative-path (u/get-relative-path project-path selected-path)]
    (-> dialog .getEditor (.setText relative-path))
    (when-let [new-relative-path (-> dialog .showAndWait (.orElse nil))]
      (when (not= relative-path new-relative-path)
        (let [new-file (io/file project-path new-relative-path)
              new-path (.getCanonicalPath new-file)
              project-tree (.lookup scene "#project_tree")]
          (.mkdirs (.getParentFile new-file))
          (.renameTo (io/file selected-path) new-file)
          (u/delete-parents-recursively! (:project-set @pref-state) selected-path)
          (p/update-project-tree! pref-state project-tree new-path))))))

(defn -onRename [this ^ActionEvent event]
  (-> event .getSource .getScene rename!))

; remove

(defn remove! [^Scene scene]
  (let [{:keys [project-set selection]} @pref-state
        message (if (contains? project-set selection)
                  "Remove this project? It WILL NOT be deleted from the disk."
                  "Remove this file? It WILL be deleted from the disk.")
        dialog (doto (Alert. Alert$AlertType/CONFIRMATION)
                 (.setTitle "Remove")
                 (.setHeaderText message)
                 (.setGraphic nil)
                 (.initOwner (.getWindow scene))
                 (.initModality Modality/WINDOW_MODAL))
        project-tree (.lookup scene "#project_tree")]
    (when (-> dialog .showAndWait (.orElse nil) (= ButtonType/OK))
      (p/remove-from-project-tree! pref-state selection)
      (p/update-project-tree! pref-state project-tree))))

(defn -onRemove [this ^ActionEvent event]
  (-> event .getSource .getScene remove!))

; up

(defn up! [^Scene scene]
  (when-let [path (:selection @pref-state)]
    (let [project-tree (.lookup scene "#project_tree")]
      (->> path io/file .getParentFile .getCanonicalPath
           (p/update-project-tree! pref-state project-tree)))))

(defn -onUp [this ^ActionEvent event]
  (-> event .getSource .getScene up!))

; save

(defn save! [^Scene scene]
  (when-let [path (:selection @pref-state)]
    (when-let [pane (get (:editor-panes @runtime-state) path)]
      (let [editor (.lookup pane "#editor")
            engine (.getEngine editor)]
        (spit (io/file path) (.executeScript engine "getTextContent()"))
        (.executeScript engine "markClean()")))))

(defn -onSave [this ^ActionEvent event]
  (-> event .getSource .getScene save!))

; undo

(defn -onUndo [this ^ActionEvent event])

; redo

(defn -onRedo [this ^ActionEvent event])

; instaREPL

(defn toggle-instarepl! [^Scene scene]
  (when-let [path (:selection @pref-state)]
    (when-let [pane (get (:editor-panes @runtime-state) path)]
      (let [editor (.lookup pane "#editor")
            engine (.getEngine editor)
            instarepl (.lookup pane "#instarepl")]
        (when scene ; ugly way of determining if we need to manually change the toggle
          (.setSelected instarepl (not (.isSelected instarepl))))
        (e/toggle-instarepl! engine (.isSelected instarepl))))))

(defn -onInstaRepl [this ^ActionEvent event]
  (toggle-instarepl! nil))

; find

(defn focus-on-find! [^Scene scene]
  (when-let [find (.lookup scene "#find")]
    (doto find .requestFocus .selectAll)))

(defn -find [this ^KeyEvent event]
  (when (= KeyCode/ENTER (.getCode event))
    (when-let [path (:selection @pref-state)]
      (when-let [pane (get (:editor-panes @runtime-state) path)]
        (let [editor (.lookup pane "#editor")
              engine (.getEngine editor)
              find (.lookup pane "#find")
              find-text (.getText find)]
          (.executeScript engine
            (format "window.find('%s', true, %b)"
              (str/escape find-text {\' "\\'"})
              (.isShiftDown event))))))))

; close

(defn close! [^Scene scene]
  (when-let [path (:selection @pref-state)]
    (let [file (io/file path)
          new-path (if (.isDirectory file)
                     path
                     (.getCanonicalPath (.getParentFile file)))
          project-tree (.lookup scene "#project_tree")]
      (e/remove-editors! path runtime-state)
      (p/update-project-tree! pref-state project-tree new-path))))

(defn -onClose [this ^ActionEvent event]
  (-> event .getSource .getScene close!))
