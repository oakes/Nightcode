(ns {{desktop-namespace}}
  (:require [{{namespace}}])
  (:import [com.badlogic.gdx.backends.lwjgl LwjglApplication]
           [org.lwjgl.input Keyboard])
  (:gen-class))

(defn -main
  []
  (LwjglApplication. ({{java-namespace}}.Game.) "{{app-name}}" 800 600 true)
  (Keyboard/enableRepeatEvents true))
