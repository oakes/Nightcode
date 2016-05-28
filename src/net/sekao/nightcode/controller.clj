(ns net.sekao.nightcode.controller
  (:require [clojure.java.io :as io]
            [net.sekao.nightcode.boot :as b]
            [net.sekao.nightcode.projects :as p]
            [net.sekao.nightcode.state :refer [state]]
            [clojure.spec :as s :refer [fdef]])
  (:import [javafx.event ActionEvent]
           [javafx.scene.control Alert Alert$AlertType ButtonType TextInputDialog]
           [javafx.stage DirectoryChooser FileChooser StageStyle Window]
           [javafx.application Platform]
           [javafx.scene Scene])
  (:gen-class
   :methods [[onNewConsoleProject [javafx.event.ActionEvent] void]
             [onImport [javafx.event.ActionEvent] void]
             [onRename [javafx.event.ActionEvent] void]
             [onRemove [javafx.event.ActionEvent] void]]))

(fdef new-project!
  :args (s/cat :scene #(instance? Scene %) :project-type keyword?))
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
              (swap! state update :project-set conj (.getCanonicalPath file))
              (p/update-project-tree! state project-tree))))))))

(defn -onNewConsoleProject [this ^ActionEvent event]
  (new-project! (-> event .getSource .getParentPopup .getOwnerWindow .getScene) :app))

(defn -onImport [this ^ActionEvent event]
  (let [chooser (doto (DirectoryChooser.)
                  (.setTitle "Import"))
        scene (-> event .getSource .getScene)
        project-tree (.lookup scene "#project_tree")]
    (when-let [file (.showDialog chooser (.getWindow scene))]
      (let [path (.getCanonicalPath file)]
        (swap! state update :project-set conj path)
        (p/update-project-tree! state project-tree path)))))

(defn -onRename [this ^ActionEvent event]
  (let [scene (-> event .getSource .getScene)
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
          (p/update-project-tree! state project-tree new-path))))))

(defn -onRemove [this ^ActionEvent event]
  (let [{:keys [project-set selection]} @state
        message (if (contains? project-set selection)
                  "Remove this project? It WILL NOT be deleted from the disk."
                  "Remove this file? It WILL be deleted from the disk.")
        scene (-> event .getSource .getScene)
        dialog (doto (Alert. Alert$AlertType/CONFIRMATION)
                 (.setTitle "Remove")
                 (.setHeaderText message)
                 (.setGraphic nil)
                 (.initOwner (.getWindow scene)))
        project-tree (.lookup scene "#project_tree")]
    (when (-> dialog .showAndWait (.orElse nil) (= ButtonType/OK))
      (p/remove-from-project-tree! state selection)
      (p/update-project-tree! state project-tree))))