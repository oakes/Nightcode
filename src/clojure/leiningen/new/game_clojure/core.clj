(ns {{namespace}}
  (:require [play-clj.core :refer :all])
  (:import [com.badlogic.gdx.graphics Color]
           [com.badlogic.gdx.graphics.g2d BitmapFont]
           [com.badlogic.gdx.scenes.scene2d.ui Label Label$LabelStyle]))

(defscreen main-screen
  :on-show
  (fn [screen entities]
    (create-renderer! screen :type :stage)
    (let [style (Label$LabelStyle. (BitmapFont.) (Color. 1 1 1 1))
          label (Label. "Hello world!" style)]
      [label]))
  :on-render
  (fn [screen entities]
    (clear!)
    (draw! screen entities)
    entities))

(defgame {{app-name}}
  :on-create
  (fn [this]
    (set-screen! this main-screen)))
