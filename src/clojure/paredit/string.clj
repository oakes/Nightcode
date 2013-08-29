(ns ^{:doc "Complement to clojure.string"}
     paredit.string
  (:refer-clojure :exclude [repeat]))

(defn repeat 
  "Returns a new String containing the String s
   n times concatenated to itself"
  [s n]
  (apply str (clojure.core/repeat n s)))

