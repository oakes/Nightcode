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
                           :text-size (read-pref :text-size 16)
                           :auto-save? (read-pref :auto-save? true)}))

(defonce runtime-state (atom {:web-port nil
                              :project-panes {}
                              :editor-panes {}
                              :processes {}
                              :stage nil}))

(add-watch pref-state :write-prefs
  (fn [_ _ old-state new-state]
    (doseq [key [:project-set :expansion-set :selection :theme :text-size :auto-save?]]
      (let [old-val (get old-state key)
            new-val (get new-state key)]
        (when (not= old-val new-val)
          (write-pref! key new-val))))))

; specs

(fdef write-pref!
  :args (s/cat :key keyword? :val any?))

(fdef remove-pref!
  :args (s/cat :key keyword?))

(fdef read-pref
  :args (s/alt
          :key-only (s/cat :key keyword?)
          :key-and-val (s/cat :key keyword? :default-val identity)))

