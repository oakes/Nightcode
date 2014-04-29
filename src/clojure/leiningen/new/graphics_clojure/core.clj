(ns {{namespace}}
  (:require [quil.core :refer :all]))

(defn setup []
  (smooth))

(defn draw []
  (background 255)
  (fill 192)
  (ellipse 100 100 30 30))

(defsketch example
  :title "Example" 
  :setup setup
  :draw draw
  :size [200 200])

(defn -main [& args])
