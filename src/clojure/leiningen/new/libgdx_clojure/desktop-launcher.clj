(ns {{desktop-namespace}}
  (:require [{{namespace}}])
  (:import [com.badlogic.gdx.backends.lwjgl LwjglApplication])
  (:gen-class))

(defn -main
  []
  (LwjglApplication. ({{namespace}}.Game.) "{{app-name}}" 800 600 true))
