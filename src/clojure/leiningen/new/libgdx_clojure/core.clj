(ns {{namespace}}
  (:import [com.badlogic.gdx Game Gdx Graphics Screen]
           [com.badlogic.gdx.graphics Color GL20]
           [com.badlogic.gdx.graphics.g2d BitmapFont]
           [com.badlogic.gdx.scenes.scene2d Stage]
           [com.badlogic.gdx.scenes.scene2d.ui Label Label$LabelStyle]))

(declare ^Stage stage)

(def main-screen
  (proxy [Screen] []
    (show []
      (def stage (Stage.))
      (let [style (Label$LabelStyle. (BitmapFont.) (Color. 1.0 1.0 1.0 1.0))
            label (Label. "Hello world!" style)]
        (.addActor stage label)))
    (render [delta]
      (.glClearColor (Gdx/gl) 0 0 0 1)
      (.glClear (Gdx/gl) GL20/GL_COLOR_BUFFER_BIT)
      (doto stage
        (.act delta)
        (.draw)))
    (dispose[])
    (hide [])
    (pause [])
    (resize [w h])
    (resume [])))

(gen-class
  :name {{namespace}}.Game
  :extends com.badlogic.gdx.Game)
(defn -create [^Game this]
  (.setScreen this main-screen))
