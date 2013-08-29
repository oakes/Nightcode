(ns paredit.utils)
#_(set! *warn-on-reflection* true)
(defn bin-search 
  "search by dichotomy on a vector. Returns the offset of the element, or nil if not found.
   f applied to the currently examined value must return 0 if the correct value is found, a negative number is the current value is less than the searched value,
   a positive number if the current value is more than the searched value.
   to be efficient, coll must be fast for `get and `count functions."
  ([coll f] (bin-search [get count] coll f))
  ([[get count] coll f] #_(println (str "bin-search: coll count=" (dec (count coll))))
                        (bin-search get coll f 0 (dec (count coll))))
  ([get coll f x y]
    #_(println (str "bin-search: x=" x ", y=" y))
    (cond
      (< y x)  nil
      (= y x) (when (zero? (f (get coll x))) x)
      :else   (let [pivot (+ x (quot (- y x) 2))
                    fv    (f (get coll pivot))]
                (cond
                  (zero? fv) pivot
                  (neg? fv) (recur get coll f (inc pivot) y)
                  :else     (recur get coll f x (dec pivot)))))))

(defn range-contains-in-ex [x [range-start-inclusive
                               range-stop-exclusive]]
  (cond
    (<  x range-start-inclusive)  1
    (>= x range-stop-exclusive)  -1
    :else                         0))

(defn range-contains-ex-in [x [range-start-exclusive
                               range-stop-inclusive]]
  (cond
    (<= x range-start-exclusive)  1
    (>  x range-stop-inclusive)  -1
    :else                         0))
