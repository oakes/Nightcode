(ns nightcode.customizations
  (:require [clojure.edn :as edn]
            [clojure.java.io :as io]
            [clojure.string :as str]
            [clojure.tools.cli :as cli])
  (:import [org.pushingpixels.substance.api.skin SubstanceGraphiteLookAndFeel]))

(def edn-prefs (or (try
                     (-> (System/getProperty "user.home")
                         (io/file "nightcode.edn")
                         slurp
                         edn/read-string)
                     (catch Exception _))
                   (try
                     (-> (System/getProperty "user.home")
                         (io/file ".config" "nightcode.edn")
                         slurp
                         edn/read-string)
                     (catch Exception _))))

(defn make-skin-map []
  {;; dark skins
   "dark"            [(SubstanceGraphiteLookAndFeel.)       :dark]  ; default dark
   "graphite"        [(SubstanceGraphiteLookAndFeel.)       :dark]})

(defn abort
  [& msgs]
  (binding [*out* *err*]
    (apply println msgs)
    (System/exit 1)))

(defn show-help [help-str]
  (let [shade-names (fn [shade skin-map]
                      (str/join ", " (->> skin-map
                                       (filter #(= shade (second (second %))))
                                       (map first)
                                       sort)))
        skin-map (make-skin-map)]
    (abort
      (format "%s
Dark skin names: %s
Light skin names: %s
"
              help-str
              (shade-names :dark skin-map)
              (shade-names :light skin-map)))))

(defn parse-args
  [args]
  (let [[opts tokens help-str] (cli/cli args
                                        ["-h" "--help" :flag true]
                                        ["-s" "--skin"]
                                        ["-p" "--panel"]
                                        ["-t" "--theme-resource"])
        opts (assoc opts
                    :skin (name (or (:skin opts)
                                    (:skin edn-prefs)
                                    :dark))
                    :panel (name (or (:panel opts)
                                     (:panel edn-prefs)
                                     :vertical))
                    :theme-resource (or (:theme-resource opts)
                                        (:theme-resource edn-prefs)))
        skin-map (make-skin-map)]
    (cond
      (:help opts)
      (show-help help-str)
      
      (and (:theme-resource opts)
           (not (:skin opts)))
      (abort "ERROR: Must specify skin with theme")
      
      (when-let [skin (:skin opts)]
        (not (contains? skin-map skin)))
      (abort "ERROR: Invalid skin")
      
      (when-let [th-res (:theme-resource opts)]
        (not (.isFile (io/file th-res))))
      (abort "ERROR: Not such file found:" (:theme-resource opts))
      
      :else (let [skin (:skin opts)
                  [skin-obj shade] (get skin-map skin)]
              (assoc opts
                     :shade shade
                     :skin-object skin-obj
                     :theme-resource (or (some-> (:theme-resource opts) io/file)
                                         (io/resource
                                           (if (= :light shade)
                                             "light.xml" "dark.xml"))))))))
