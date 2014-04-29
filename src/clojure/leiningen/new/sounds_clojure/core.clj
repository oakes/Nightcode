(ns {{namespace}}
  (:require [overtone.live :refer :all]))

(defn play
  []
  (demo 7 (lpf (mix (saw [50 (line 100 1600 5) 101 100.5]))
               (lin-lin (lf-tri (line 2 20 5)) -1 1 400 4000))))

(defn -main [& args]
  (play))
