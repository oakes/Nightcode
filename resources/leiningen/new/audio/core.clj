(ns {{namespace}}
  (:require [alda.lisp :refer :all]
            [alda.now :as now])
  (:gen-class))

(defn -main [& args]
  (now/play!
    (part "accordion"
      (note (pitch :c) (duration (note-length 8)))
      (note (pitch :d))
      (note (pitch :e :flat))
      (note (pitch :f))
      (note (pitch :g))
      (note (pitch :a :flat))
      (note (pitch :b))
      (octave :up)
      (note (pitch :c)))))

