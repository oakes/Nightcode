(ns {{name}}.move
  (:require [{{name}}.utils :as utils]
            #?(:clj  [play-cljc.macros-java :refer [gl math]]
               :cljs [play-cljc.macros-js :refer-macros [gl math]])))

(def ^:const damping 0.1)
(def ^:const max-velocity 1000)
(def ^:const max-jump-velocity (* max-velocity 8))
(def ^:const deceleration 0.7)
(def ^:const gravity 500)
(def ^:const animation-secs 0.2)

(defn decelerate
  [velocity]
  (let [velocity (* velocity deceleration)]
    (if (< (math abs velocity) damping)
      0
      velocity)))

(defn get-x-velocity
  [{:keys [pressed-keys x-velocity]}]
  (cond
    (contains? pressed-keys :left)
    (* -1 max-velocity)
    (contains? pressed-keys :right)
    max-velocity
    :else
    x-velocity))

(defn get-y-velocity
  [{:keys [pressed-keys y-velocity can-jump?]}]
  (cond
    (and can-jump? (contains? pressed-keys :up))
    (* -1 max-jump-velocity)
    :else
    y-velocity))

(defn get-direction
  [{:keys [x-velocity direction]}]
  (cond
    (> x-velocity 0) :right
    (< x-velocity 0) :left
    :else
    direction))

(defn move
  [{:keys [delta-time] :as game} {:keys [player-x player-y can-jump?] :as state}]
  (let [x-velocity (get-x-velocity state)
        y-velocity (+ (get-y-velocity state) gravity)
        x-change (* x-velocity delta-time)
        y-change (* y-velocity delta-time)]
    (if (or (not= 0 x-change) (not= 0 y-change))
      (assoc state
             :x-velocity (decelerate x-velocity)
             :y-velocity (decelerate y-velocity)
             :x-change x-change
             :y-change y-change
             :player-x (+ player-x x-change)
             :player-y (+ player-y y-change)
             :can-jump? (if (neg? y-velocity) false can-jump?))
      state)))

(defn prevent-move
  [game {:keys [player-x player-y
                player-width player-height
                x-change y-change]
         :as state}]
  (let [old-x (- player-x x-change)
        old-y (- player-y y-change)
        up? (neg? y-change)
        game-width (utils/get-width game)
        game-height (utils/get-height game)]
    (merge state
      (when (or (< player-x 0)
                (> player-x (- game-width player-width)))
        {:x-velocity 0 :x-change 0 :player-x old-x})
      (when (> player-y (- game-height player-height))
        {:y-velocity 0 :y-change 0 :player-y old-y :can-jump? (not up?)}))))

(defn animate
  [{:keys [total-time]}
   {:keys [x-velocity y-velocity direction
           player-images player-image-key]
    :as state}]
  (let [direction (get-direction state)]
    (-> state
        (assoc :player-image-key
               (if (and (not= x-velocity 0)
                        (= y-velocity 0))
                 (let [image-keys (->> player-images keys sort vec)
                       cycle-time (mod total-time (* animation-secs (count image-keys)))]
                   (nth image-keys (int (/ cycle-time animation-secs))))
                 player-image-key))
        (assoc :direction direction))))

