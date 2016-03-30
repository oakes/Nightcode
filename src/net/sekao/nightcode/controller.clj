(ns net.sekao.nightcode.controller
  (:require [clojure.java.io :as io]
            [net.sekao.nightcode.boot :as b]
            [net.sekao.nightcode.projects :as p]
            [net.sekao.nightcode.state :refer [state]])
  (:import [javafx.event ActionEvent]
           [javafx.scene.control Alert Alert$AlertType ButtonType TextInputDialog]
           [javafx.stage DirectoryChooser FileChooser StageStyle Window]
           [javafx.application Platform])
  (:gen-class
   :methods [[onNewProject [javafx.event.ActionEvent] void]
             [onImport [javafx.event.ActionEvent] void]
             [onRename [javafx.event.ActionEvent] void]
             [onRemove [javafx.event.ActionEvent] void]]))

(defn event->scene [^ActionEvent event]
  (-> event .getSource .getScene))

(defn -onNewProject [this ^ActionEvent event]
  (let [chooser (doto (FileChooser.)
                  (.setTitle "New Project"))
        scene (event->scene event)
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
          (b/new-project! file)
          (Platform/runLater
            (fn []
              (.hide dialog)
              (-> state
                  (swap! update :project-set conj (.getCanonicalPath file))
                  (p/update-project-tree! project-tree)))))))))

(defn -onImport [this ^ActionEvent event]
  (let [chooser (doto (DirectoryChooser.)
                  (.setTitle "Import"))
        scene (event->scene event)
        project-tree (.lookup scene "#project_tree")]
    (when-let [file (.showDialog chooser (.getWindow scene))]
      (let [path (.getCanonicalPath file)]
        (-> state
            (swap! update :project-set conj path)
            (p/update-project-tree! project-tree path))))))

(defn -onRename [this ^ActionEvent event]
  (let [scene (event->scene event)
        dialog (doto (TextInputDialog.)
                 (.setTitle "Rename")
                 (.setHeaderText "Enter a path relative to the project root.")
                 (.setGraphic nil)
                 (.initOwner (.getWindow scene)))
        project-path (p/get-project-root-path @state)
        selected-path (:selection @state)
        relative-path (p/get-relative-path project-path selected-path)]
    (-> dialog .getEditor (.setText relative-path))
    (when-let [new-relative-path (-> dialog .showAndWait (.orElse nil))]
      (when (not= relative-path new-relative-path)
        (let [new-file (io/file project-path new-relative-path)
              new-path (.getCanonicalPath new-file)
              project-tree (.lookup scene "#project_tree")]
          (.mkdirs (.getParentFile new-file))
          (.renameTo (io/file selected-path) new-file)
          (p/delete-parents-recursively! (:project-set @state) selected-path)
          (p/update-project-tree! @state project-tree new-path))))))

(defn -onRemove [this ^ActionEvent event]
  (let [{:keys [project-set selection]} @state
        message (if (contains? project-set selection)
                  "Remove this project? It WILL NOT be deleted from the disk."
                  "Remove this file? It WILL be deleted from the disk.")
        scene (event->scene event)
        dialog (doto (Alert. Alert$AlertType/CONFIRMATION)
                 (.setTitle "Remove")
                 (.setHeaderText message)
                 (.setGraphic nil)
                 (.initOwner (.getWindow scene)))
        project-tree (.lookup scene "#project_tree")]
    (when (-> dialog .showAndWait (.orElse nil) (= ButtonType/OK))
      (p/remove-from-project-tree! state selection)
      (p/update-project-tree! @state project-tree))))
