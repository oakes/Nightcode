(ns net.sekao.nightcode.boot
  (:require [boot.core :as core]
            [boot.task.built-in :as built-in]))

(defn new-project [project-name]
  (core/boot (built-in/speak)))
