(ns net.sekao.nightcode.spec
  (:require [clojure.spec :as s]))

(defn file? [x]
  (instance? java.io.File x))

(def file-array-type (type (make-array java.io.File 0)))

(defn file-array? [x]
  (instance? file-array-type x))

(defn node? [x]
  (instance? javafx.scene.Node x))

(defn pane? [x]
  (instance? javafx.scene.layout.Region x))

(defn tree-item? [x]
  (instance? javafx.scene.control.TreeItem x))

(defn obs-list? [x]
  (instance? javafx.collections.ObservableList x))

(defn atom? [x]
  (instance? clojure.lang.Atom x))

(defn scene? [x]
  (instance? javafx.scene.Scene x))

(defn stage? [x]
  (instance? javafx.stage.Stage x))

(defn ns? [x]
  (instance? clojure.lang.Namespace x))

(s/def ::files
  (s/or :primitive-array file-array?
        :collection (s/coll-of file?)))
