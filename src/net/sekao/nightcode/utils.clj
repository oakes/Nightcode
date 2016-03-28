(ns net.sekao.nightcode.utils
  (:import [javafx.event ActionEvent]))

(defn event->window [^ActionEvent event]
  (-> event .getSource .getScene .getWindow))