(ns net.sekao.nightcode.controller
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [net.sekao.nightcode.builders :as b]
            [net.sekao.nightcode.editors :as e]
            [net.sekao.nightcode.process :as proc]
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
             [onClose [javafx.event.ActionEvent] void]
             [onRun [javafx.event.ActionEvent] void]
             [onRunWithRepl [javafx.event.ActionEvent] void]
             [onReload [javafx.event.ActionEvent] void]
             [onBuild [javafx.event.ActionEvent] void]
             [onClean [javafx.event.ActionEvent] void]
             [onStop [javafx.event.ActionEvent] void]]))

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
                     (.initStyle StageStyle/UNDECORATED))
            process (atom nil)
            dir (-> file .getParentFile .getCanonicalPath)
            project-name (-> file .getName str/lower-case)]
        (-> dialog .getDialogPane (.lookupButton ButtonType/OK) (.setDisable true))
        (.show dialog)
        (future
          (try
            (proc/start-java-process! process dir "Boot"
              "--no-boot-script"
              "-d" "seancorfield/boot-new:0.4.4" "new"
              "-t" (name project-type)
              "-n" project-name)
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
          (e/remove-editors! selected-path runtime-state)
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
    (let [webview (.lookup scene "#webview")
          engine (.getEngine webview)]
      (spit (io/file path) (.executeScript engine "getTextContent()"))
      (.executeScript engine "markClean()"))))

(defn -onSave [this ^ActionEvent event]
  (-> event .getSource .getScene save!))

; undo

(defn undo! [^Scene scene]
  (let [editor (.lookup scene "#editor")
        webview (.lookup scene "#webview")
        engine (.getEngine webview)]
    (.executeScript engine "undo()")
    (e/update-editor-buttons! editor engine)))

(defn -onUndo [this ^ActionEvent event]
  (-> event .getSource .getScene undo!))

; redo

(defn redo! [^Scene scene]
  (let [editor (.lookup scene "#editor")
        webview (.lookup scene "#webview")
        engine (.getEngine webview)]
    (.executeScript engine "redo()")
    (e/update-editor-buttons! editor engine)))

(defn -onRedo [this ^ActionEvent event]
  (-> event .getSource .getScene redo!))

; instaREPL

(defn toggle-instarepl! [^Scene scene & [from-button?]]
  (let [webview (.lookup scene "#webview")
        instarepl (.lookup scene "#instarepl")]
    (when-not from-button?
      (.setSelected instarepl (not (.isSelected instarepl))))
    (e/toggle-instarepl! (.getEngine webview) (.isSelected instarepl))))

(defn -onInstaRepl [this ^ActionEvent event]
  (-> event .getSource .getScene (toggle-instarepl! true)))

; find

(defn focus-on-find! [^Scene scene]
  (when-let [find (.lookup scene "#find")]
    (doto find .requestFocus .selectAll)))

(defn find! [^Scene scene ^KeyEvent event]
  (when (= KeyCode/ENTER (.getCode event))
    (when-let [path (:selection @pref-state)]
      (let [webview (.lookup scene "#webview")
            engine (.getEngine webview)
            find (.lookup scene "#find")
            find-text (.getText find)]
        (.executeScript engine
          (format "window.find('%s', true, %b)"
            (u/escape-js find-text)
            (.isShiftDown event)))))))

(defn -find [this ^KeyEvent event]
  (-> event .getSource .getScene (find! event)))

; close

(defn close! [^Scene scene]
  (when-let [path (:selection @pref-state)]
    (let [file (io/file path)
          new-path (if (.isDirectory file)
                     path
                     (.getCanonicalPath (.getParentFile file)))
          project-tree (.lookup scene "#project_tree")]
      (e/remove-editors! path runtime-state)
      (p/update-project-tree-selection! project-tree new-path))))

(defn -onClose [this ^ActionEvent event]
  (-> event .getSource .getScene close!))

; run

(defn run-normal! [^Scene scene]
  (when-let [project-path (u/get-project-root-path @pref-state)]
    (b/refresh-builder! @runtime-state project-path false)
    (b/start-builder-process! runtime-state project-path "run" "Running...")))

(defn -onRun [this ^ActionEvent event]
  (-> event .getSource .getScene run-normal!))

; run with repl

(defn run-with-repl! [^Scene scene])

(defn -onRunWithRepl [this ^ActionEvent event]
  (-> event .getSource .getScene run-with-repl!))

; reload

(defn reload! [^Scene scene])

(defn -onReload [this ^ActionEvent event]
  (-> event .getSource .getScene reload!))

; build

(defn build! [^Scene scene])

(defn -onBuild [this ^ActionEvent event]
  (-> event .getSource .getScene build!))

; clean

(defn clean! [^Scene scene])

(defn -onClean [this ^ActionEvent event]
  (-> event .getSource .getScene clean!))

; stop

(defn stop! [^Scene scene]
  (when-let [project-path (u/get-project-root-path @pref-state)]
    (b/stop-builder-process! runtime-state project-path)))

(defn -onStop [this ^ActionEvent event]
  (-> event .getSource .getScene stop!))

