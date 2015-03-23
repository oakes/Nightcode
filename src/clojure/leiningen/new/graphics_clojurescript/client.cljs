(ns breakout.core
  (:require [quil.core :as q :include-macros true]
            [quil.middleware :as m]))

(q/defsketch example
  :host "sketch"
  
  :size [(.-innerWidth js/window) (.-innerHeight js/window)]
  
  :middleware [m/fun-mode]
  
  ; create the initial state
  :setup
  (fn []
    {:x 0 :y 0 :r 10})
  
  ; draw the state
  :draw
  (fn [state]
    (q/background 255)
    (q/ellipse (:x state) (:y state) (:r state) (:r state)))
  
  ; update the state on each frame
  :update
  (fn [state]
    (update-in state [:r] inc))
  
  ; update the state when the mouse is moved
  :mouse-moved
  (fn [state event]
    (-> state
      (assoc :x (:x event) :y (:y event))
      (update-in [:r] #(min 10 (dec %))))))
