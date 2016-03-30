(ns net.sekao.nightcode.controller
  (:require [net.sekao.nightcode.utils :as u]
            [net.sekao.nightcode.boot :as b]
            [net.sekao.nightcode.projects :as p])
  (:import [javafx.event ActionEvent]
           [javafx.scene.control Alert Alert$AlertType ButtonType TextInputDialog]
           [javafx.stage DirectoryChooser FileChooser StageStyle Window]
           [javafx.application Platform])
  (:gen-class
   :methods [[onNewProject [javafx.event.ActionEvent] void]
             [onImport [javafx.event.ActionEvent] void]
             [onRename [javafx.event.ActionEvent] void]
             [onRemove [javafx.event.ActionEvent] void]]))

(defonce state (atom {:project-set (u/read-pref :project-set)
                      :expansion-set (u/read-pref :expansion-set)
                      :selection (u/read-pref :selection)}))

(defn -onNewProject [this ^ActionEvent event]
  (let [chooser (doto (FileChooser.)
                  (.setTitle "New Project"))
        scene (u/event->scene event)
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
        scene (u/event->scene event)
        project-tree (.lookup scene "#project_tree")]
    (when-let [file (.showDialog chooser (.getWindow scene))]
      (-> state
          (swap! update :project-set conj (.getCanonicalPath file))
          (p/update-project-tree! project-tree)))))

(defn -onRename [this ^ActionEvent event]
  (let [dialog (doto (TextInputDialog.)
                 (.setTitle "Rename")
                 (.setHeaderText "Enter a path relative to the project root.")
                 (.setGraphic nil)
                 (.initOwner (.getWindow (u/event->scene event))))]
    (when-let [result (-> dialog .showAndWait (.orElse nil))]
      (println result))))

(defn -onRemove [this ^ActionEvent event]
  (let [message (if true ; TODO
                  "Remove this project? It WILL NOT be deleted from the disk."
                  "Remove this file? It WILL be deleted from the disk.")
        dialog (doto (Alert. Alert$AlertType/CONFIRMATION)
                 (.setTitle "Remove")
                 (.setHeaderText message)
                 (.setGraphic nil)
                 (.initOwner (.getWindow (u/event->scene event))))]
    (when (-> dialog .showAndWait (.orElse nil) (= ButtonType/OK))
      (println "remove"))))
