(ns nightcode.start
  "This ns is a workaround for an issue that prevented making uberjars
   with JavaFX 11. See https://stackoverflow.com/a/52571719"
  (:require [nightcode.core :as c])
  (:gen-class))

(defn -main [& args]
  (c/main))
