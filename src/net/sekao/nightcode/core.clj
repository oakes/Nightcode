(ns net.sekao.nightcode.core
  (:require [clojure.java.io :as io]
            [net.sekao.nightcode.utils :as u]
            [net.sekao.nightcode.projects :as p]
            [net.sekao.nightcode.boot :as b]
            [net.sekao.nightcode.controller :refer [state]])
  (:import [javafx.application Application]
           [javafx.fxml FXMLLoader]
           [javafx.stage Stage StageBuilder]
           [javafx.scene Scene])
  (:gen-class :extends javafx.application.Application))

(add-watch state :state-changed
  (fn [_ _ old-state new-state]
    (let [old-projects (:project-set old-state)
          new-projects (:project-set new-state)
          old-expansions (:expansion-set old-state)
          new-expansions (:expansion-set new-state)
          old-selection (:selection old-state)
          new-selection (:selection new-state)]
      (when (not= old-projects new-projects)
        (u/write-pref! :project-set new-projects))
      (when (not= old-expansions new-expansions)
        (u/write-pref! :expansion-set new-expansions))
      (when (not= old-selection new-selection)
        (u/write-pref! :selection new-selection)))))

(defn -start [^net.sekao.nightcode.core app ^Stage stage]
  (let [root (FXMLLoader/load (clojure.java.io/resource "main.fxml"))
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
    (p/set-selection-listener! state scene project-tree)))

(defn -main [& args]
  (Application/launch net.sekao.nightcode.core (into-array String args)))

(defn dev-main [& args]
  (apply -main args))
