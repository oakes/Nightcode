(ns {{android-namespace}}
  (:require [{{namespace}}]))

(gen-class
  :name {{package}}.{{activity}}
  :extends com.badlogic.gdx.backends.android.AndroidApplication
  :exposes-methods [superOnCreate onCreate])
(defn -onCreate [this saved-instance-state]
  (superOnCreate this saved-instance-state)
  (.initialize this ({{namespace}}.Game.) false))
