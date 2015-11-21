(ns net.sekao.nightcode.core
  (:import [javafx.application Application]
           [javafx.fxml FXMLLoader]
           [javafx.stage Stage StageBuilder]
           [javafx.scene Scene])
  (:gen-class :extends javafx.application.Application))

(defn -start [app ^Stage stage]
  (let [root (FXMLLoader/load (clojure.java.io/resource "main.fxml"))]
    (doto stage
      (.setTitle "Nightcode")
      (.setScene (Scene. root 800 600))
      (.show))))

(defn -main [& args]
  (Application/launch net.sekao.nightcode.core (into-array String args)))

(defn main [& args]
  (apply -main args))
