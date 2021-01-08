(ns {{namespace}}
  (:require [seesaw.core :as s])
  (:gen-class))

(defn center! [frame]
  (.setLocationRelativeTo frame nil))

(defn -main [& args]
  (s/invoke-later
    (doto (s/frame :title "{{name}}"
                   :content "Welcome to {{name}}!"
                   :on-close :exit
                   :size [300 :by 300])
      center!
      s/show!)))
