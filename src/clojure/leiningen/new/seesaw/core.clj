(ns {{name}}.core
  (:use seesaw.core)
  (:gen-class))

(defn- center! [frame]
  (.setLocationRelativeTo frame nil)
  frame)

(defn -main [& args]
  (invoke-later
    (-> (frame :title "{{name}}",
           :content "Welcome to {{name}}!",
           :on-close :exit
           :size [300 :by 300])
     center!
     show!)))
