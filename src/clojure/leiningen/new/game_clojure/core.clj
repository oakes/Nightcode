(ns {{namespace}}
  (:import [com.badlogic.gdx Game Gdx Graphics Screen]
           [com.badlogic.gdx.graphics Color GL20]
           [com.badlogic.gdx.graphics.g2d BitmapFont]
           [com.badlogic.gdx.scenes.scene2d Stage]
           [com.badlogic.gdx.scenes.scene2d.ui Label Label$LabelStyle]))

(defn show
  [stage]
  (let [style (Label$LabelStyle. (BitmapFont.) (Color. 1 1 1 1))
        label (Label. "Hello world!" style)]
    (.addActor stage label)))

(defn render
  [stage delta]
  (.glClearColor (Gdx/gl) 0 0 0 0)
  (.glClear (Gdx/gl) GL20/GL_COLOR_BUFFER_BIT)
  (doto stage
    (.act delta)
    (.draw)))

(def main-screen
  (let [stage (atom nil)]
    (proxy [Screen] []
      (show [] (show (reset! stage (Stage.))))
      (render [delta] (render @stage delta))
      (dispose [])
      (hide [])
      (pause [])
      (resize [w h])
      (resume []))))

(gen-class
  :name {{package}}.Game
  :extends com.badlogic.gdx.Game)
(defn -create [^Game this]
  (.setScreen this main-screen))
