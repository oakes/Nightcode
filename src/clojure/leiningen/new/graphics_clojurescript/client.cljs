(ns {{namespace}}
  (:require [quil.core :as q :include-macros true]))

(defn setup []
  (q/smooth))

(defn draw []
  (q/background 255)
  (q/fill 192)
  (q/ellipse 100 100 30 30))

(q/defsketch example
  :host "sketch"
  :setup setup
  :draw draw
  :size [200 200])
