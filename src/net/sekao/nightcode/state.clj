(ns net.sekao.nightcode.state
  (:require [clojure.edn :as edn])
  (:import [java.util.prefs Preferences]))

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

; state

(defonce state (atom {:project-set (read-pref :project-set #{})
                      :expansion-set (read-pref :expansion-set #{})
                      :selection (read-pref :selection)
                      :web-port nil
                      :panes {}}))

(add-watch state :state-changed
  (fn [_ _ old-state new-state]
    (let [old-projects (:project-set old-state)
          new-projects (:project-set new-state)
          old-expansions (:expansion-set old-state)
          new-expansions (:expansion-set new-state)
          old-selection (:selection old-state)
          new-selection (:selection new-state)]
      (when (not= old-projects new-projects)
        (write-pref! :project-set new-projects))
      (when (not= old-expansions new-expansions)
        (write-pref! :expansion-set new-expansions))
      (when (not= old-selection new-selection)
        (write-pref! :selection new-selection)))))
