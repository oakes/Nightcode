(ns net.sekao.nightcode.controller
  (:require [net.sekao.nightcode.utils :as u])
  (:import [javafx.event ActionEvent]
           [javafx.scene.control Alert Alert$AlertType ButtonType TextInputDialog]
           [javafx.stage DirectoryChooser FileChooser StageStyle Window])
  (:gen-class
   :methods [[onNewProject [javafx.event.ActionEvent] void]
             [onImport [javafx.event.ActionEvent] void]
             [onRename [javafx.event.ActionEvent] void]
             [onRemove [javafx.event.ActionEvent] void]]))

(defn -onNewProject [this ^ActionEvent event]
  (let [chooser (doto (FileChooser.)
                  (.setTitle "New Project"))]
    (when-let [file (.showSaveDialog chooser (u/event->window event))]
      (println file))))

(defn -onImport [this ^ActionEvent event]
  (let [chooser (doto (DirectoryChooser.)
                  (.setTitle "Import"))]
    (when-let [file (.showDialog chooser (u/event->window event))]
      (println file))))

(defn -onRename [this ^ActionEvent event]
  (let [dialog (doto (TextInputDialog.)
                 (.setTitle "Rename")
                 (.setHeaderText "Enter a path relative to the project root.")
                 (.setGraphic nil)
                 (.initOwner (u/event->window event)))]
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
                 (.initOwner (u/event->window event)))]
    (when (-> dialog .showAndWait (.orElse nil) (= ButtonType/OK))
      (println "remove"))))
