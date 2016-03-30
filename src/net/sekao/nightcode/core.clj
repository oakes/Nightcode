(ns net.sekao.nightcode.core
  (:require [clojure.java.io :as io]
            [net.sekao.nightcode.projects :as p]
            [net.sekao.nightcode.state :refer [state]])
  (:import [javafx.application Application]
           [javafx.fxml FXMLLoader]
           [javafx.stage Stage StageBuilder]
           [javafx.scene Scene])
  (:gen-class :extends javafx.application.Application))

(defn -start [^net.sekao.nightcode.core app ^Stage stage]
  (let [root (FXMLLoader/load (io/resource "main.fxml"))
        scene (Scene. root 800 600)
        editor (.lookup scene "#editor")
        project-tree (.lookup scene "#project_tree")
        engine (.getEngine editor)]
    (doto stage
      (.setTitle "Nightcode")
      (.setScene scene)
      (.show))
    (.load engine (.toExternalForm (io/resource "public/index.html")))
    (p/update-project-tree! @state project-tree)
    (p/update-project-buttons! @state scene)
    (p/set-selection-listener! state scene project-tree)
    (p/set-expanded-listener! state scene project-tree)
    (p/set-focused-listener! state stage project-tree)))

(defn -main [& args]
  (Application/launch net.sekao.nightcode.core (into-array String args)))

(defn dev-main [& args]
  (apply -main args))
