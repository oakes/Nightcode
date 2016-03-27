(ns net.sekao.nightcode.controller
  (:import [javafx.event ActionEvent])
  (:gen-class
   :methods [[onNewProject [javafx.event.ActionEvent] void]
             [onImport [javafx.event.ActionEvent] void]
             [onRename [javafx.event.ActionEvent] void]
             [onRemove [javafx.event.ActionEvent] void]]))

(defn -onNewProject [this ^ActionEvent action-event]
  (println "on new project"))

(defn -onImport [this ^ActionEvent action-event]
  (println "on import"))

(defn -onRename [this ^ActionEvent action-event]
  (println "on rename"))

(defn -onRemove [this ^ActionEvent action-event]
  (println "on remove"))
