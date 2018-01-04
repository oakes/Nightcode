(ns nightcode.state
  (:require [clojure.edn :as edn]
            [clojure.spec.alpha :as s :refer [fdef]]))

; preferences

(declare *runtime-state)

(fdef write-pref!
  :args (s/cat :key keyword? :val any?))

(defn write-pref!
  "Writes a key-value pair to the preference file."
  [k v]
  (when-let [prefs (:prefs @*runtime-state)]
    (doto prefs
      (.put (name k) (pr-str v))
      .flush)))

(fdef remove-pref!
  :args (s/cat :key keyword?))

(defn remove-pref!
  "Removes a key-value pair from the preference file."
  [k]
  (when-let [prefs (:prefs @*runtime-state)]
    (doto prefs
      (.remove (name k))
      .flush)))

(fdef read-pref
  :args (s/alt
          :key-only (s/cat :key keyword?)
          :key-and-val (s/cat :key keyword? :default-val any?)))

(defn read-pref
  "Reads value from the given key in the preference file."
  ([k]
   (read-pref k nil))
  ([k default-val]
   (when-let [prefs (:prefs @*runtime-state)]
     (if-let [string (.get prefs (name k) nil)]
       (edn/read-string string)
       default-val))))

; state

(defonce *pref-state (atom {}))

(defonce *runtime-state (atom {:web-port nil
                               :projects {}
                               :editor-panes {}
                               :bridges {}
                               :processes {}
                               :stage nil
                               :prefs nil}))

(defn init-pref-state! [defaults]
  (->> defaults
       (map (fn [[k v]]
              [k (read-pref k v)]))
       flatten
       (apply hash-map)
       (reset! *pref-state))
  (add-watch *pref-state :write-prefs
    (fn [_ _ old-state new-state]
      (doseq [key (keys defaults)]
        (let [old-val (get old-state key)
              new-val (get new-state key)]
          (when (not= old-val new-val)
            (write-pref! key new-val)))))))

