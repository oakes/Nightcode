(ns net.sekao.nightcode.state
  (:require [clojure.edn :as edn]
            [clojure.spec :as s :refer [fdef]])
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
  ([k]
   (read-pref k nil))
  ([k default-val]
   (if-let [string (.get prefs (name k) nil)]
     (edn/read-string string)
     default-val)))

; state

(defonce pref-state (atom {:project-set (read-pref :project-set #{})
                           :expansion-set (read-pref :expansion-set #{})
                           :selection (read-pref :selection)
                           :theme (read-pref :theme :dark)
                           :text-size (read-pref :text-size 15)}))

(defonce runtime-state (atom {:web-port nil
                              :project-panes {}
                              :editor-panes {}
                              :processes {}
                              :stage nil}))

(add-watch pref-state :write-prefs
  (fn [_ _ old-state new-state]
    (let [old-projects (:project-set old-state)
          new-projects (:project-set new-state)
          old-expansions (:expansion-set old-state)
          new-expansions (:expansion-set new-state)
          old-selection (:selection old-state)
          new-selection (:selection new-state)
          old-theme (:theme old-state)
          new-theme (:theme new-state)
          old-text-size (:text-size old-state)
          new-text-size (:text-size new-state)]
      (when (not= old-projects new-projects)
        (write-pref! :project-set new-projects))
      (when (not= old-expansions new-expansions)
        (write-pref! :expansion-set new-expansions))
      (when (not= old-selection new-selection)
        (write-pref! :selection new-selection))
      (when (not= old-text-size new-text-size)
        (write-pref! :text-size new-text-size)))))

; specs

(fdef write-pref!
  :args (s/cat :key keyword? :val identity))

(fdef remove-pref!
  :args (s/cat :key keyword?))

(fdef read-pref
  :args (s/alt
          :key-only (s/cat :key keyword?)
          :key-and-val (s/cat :key keyword? :default-val identity)))

