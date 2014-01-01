(ns {{namespace}}
  (:require [play-clj.core :refer :all])
  (:import [com.badlogic.gdx.graphics Color]
           [com.badlogic.gdx.graphics.g2d BitmapFont]
           [com.badlogic.gdx.scenes.scene2d.ui Label Label$LabelStyle]))

(defn on-show
  [screen]
  (create-renderer! screen :type :stage)
  (let [style (Label$LabelStyle. (BitmapFont.) (Color. 1 1 1 1))
        label (Label. "Hello world!" style)]
    (set-entities! screen [label])))

(defn on-render
  [screen]
  (clear!)
  (draw! screen (get-entities screen)))

(defscreen main-screen
  :on-show on-show
  :on-render on-render)

(defgame {{app-name}}
  :on-create (fn [this]
               (set-screen! this main-screen)))
