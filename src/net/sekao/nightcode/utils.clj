(ns net.sekao.nightcode.utils
  (:require [clojure.edn :as edn])
  (:import [java.util.prefs Preferences]
           [javafx.event ActionEvent]))

; preferences

(def ^Preferences prefs (.node (Preferences/userRoot) "nightcode"))

(defn write-pref!
  "Writes a key-value pair to the preference file."
  [k v]
  (doto prefs
    (.put (name k) (pr-str v))
    .flush))

(defn remove-pref!
  "Removes a key-value pair from the preference file."
  [k]
  (doto prefs
    (.remove (name k))
    .flush))

(defn read-pref
  "Reads value from the given key in the preference file."
  [k & [default-val]]
  (if-let [string (.get prefs (name k) nil)]
    (edn/read-string string)
    default-val))

; misc

(defn event->scene [^ActionEvent event]
  (-> event .getSource .getScene))