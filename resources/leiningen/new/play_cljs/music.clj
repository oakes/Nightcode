(ns {{name}}.music
  (:require [edna.core :as edna]))

(def music
  [:electric-guitar-clean {:tempo 130}
   1/8 :c :c 1/2 :a 1/8 :f :g :f
   1/2 :d 1/8 :d :d 1/2 :a# 1/8 :g :a :g
   1/2 :e 1/8 :e :e 1/2 :+c 1/8 :a :a# :+c
   1/2 :+d 1/8 :f :g 1/4 :a 3/8 :f 1/8 :e :f :g :d])

(def edna->data-uri
  (memoize edna/edna->data-uri))

(defmacro build-for-cljs []
  (edna->data-uri music))

