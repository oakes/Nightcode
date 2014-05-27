(ns nightcode.cli-args
  (:require [clojure.java.io :as jio]
            [clojure.string :as str]
            [clojure.tools.cli :as cli])
  (:import [org.pushingpixels.substance.api.skin
            ;; light skin classes
            AutumnSkin BusinessSkin BusinessBlueSteelSkin BusinessBlackSteelSkin
            CremeSkin CremeCoffeeSkin DustSkin DustCoffeeSkin GeminiSkin
            MarinerSkin MistAquaSkin MistSilverSkin ModerateSkin
            NebulaSkin NebulaBrickWallSkin SaharaSkin
            ;; dark skin classes
            ChallengerDeepSkin EmeraldDuskSkin
            GraphiteSkin GraphiteGlassSkin GraphiteAquaSkin MagellanSkin 
            RavenSkin TwilightSkin]))

(defn make-skin-map []
  {;; light skins
   "autumn"               [(AutumnSkin.)             :light]
   "business"             [(BusinessSkin.)           :light]
   "business-blue-steel"  [(BusinessBlueSteelSkin.)  :light]
   "business-black-steel" [(BusinessBlackSteelSkin.) :light]
   "creme"                [(CremeSkin.)              :light]
   "creme-coffee"         [(CremeCoffeeSkin.)        :light]
   "dust"                 [(DustSkin.)               :light]
   "dust-coffee"          [(DustCoffeeSkin.)         :light]
   "gemini"               [(GeminiSkin.)             :light]
   "light"                [(DustSkin.)               :light]  ; default light
   "mariner"              [(MarinerSkin.)            :light]
   "mist-aqua"            [(MistAquaSkin.)           :light]
   "mist-silver"          [(MistSilverSkin.)         :light]
   "moderate"             [(ModerateSkin.)           :light]
   "nebula"               [(NebulaSkin.)             :light]
   "nebula-brick-wall"    [(NebulaBrickWallSkin.)    :light]
   "sahara"               [(SaharaSkin.)             :light]
   ;; dark skins
   "challenger-deep" [(ChallengerDeepSkin.) :dark]
   "dark"            [(GraphiteSkin.)       :dark]  ; default dark
   "emerald-dusk"    [(EmeraldDuskSkin.)    :dark]
   "graphite"        [(GraphiteSkin.)       :dark]
   "graphite-glass"  [(GraphiteGlassSkin.)  :dark]
   "graphite-aqua"   [(GraphiteAquaSkin.)   :dark]
   "magellan"        [(MagellanSkin.)       :dark]
   "raven"           [(RavenSkin.)          :dark]
   "twilight"        [(TwilightSkin.)       :dark]})

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
                                        ["-s" "--skin-name" :default "dark"]
                                        ["-p" "--panel" :default "vertical"]
                                        ["-t" "--theme-resource"])
        skin-map (make-skin-map)]
    (cond
      (or (not (:skin-name opts))
          (:help opts))             (show-help help-str)
      (and (:theme-resource opts)
           (not (:skin-name opts))) (abort "ERROR: Must specify skin with theme")
      (when-let [skin-name (:skin-name opts)]
        (not (contains? skin-map skin-name))) (abort "ERROR: Invalid skin-name")
      (when-let [th-res (:theme-resource opts)]
        (not (.isFile (jio/file th-res)))) (abort "ERROR: Not such file found:"
                                                  (:theme-resource opts))
      :otherwise (let [skin-name (:skin-name opts)
                       [skin-obj shade] (get skin-map skin-name)]
                   (assoc opts
                          :shade shade
                          :skin-object skin-obj
                          :theme-resource (or (when-let [filename (:theme-resource opts)]
                                                (jio/file filename))
                                              (-> (= :light shade)
                                                (if "light.xml" "dark.xml")
                                                jio/resource)))))))
