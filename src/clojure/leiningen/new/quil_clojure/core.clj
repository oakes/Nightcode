(ns {{namespace}}
  (:require [quil.core :refer :all]))

(defn setup []
  (smooth)
  (fill (random 0 255) (random 0 255) (random 0 255)))

(defn draw []
  (background 255)
   (ellipse 100 100 30 30))

(defsketch example
  :title "Example" 
  :setup setup
  :draw draw
  :size [200 200])

