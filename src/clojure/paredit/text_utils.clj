(ns paredit.text-utils
  (:use clojure.test)
  (:use [clojure.core.incubator :only [-?>]]))

#_(set! *warn-on-reflection* true)

(defn str-insert [^String s i c] 
  {:pre  [s, (<= 0 i (.length s)), c]
   :post [%]}
  (str (.substring s 0 i) c (.substring s i)))
(defn str-remove [^String s i n] 
  {:pre  [s, (<= 0 i (.length s)), (<= (+ i n) (.length s))]
   :post [%]}
  (str (.substring s 0 i) (.substring s (+ i n))))
(defn str-replace [^String s offset length text]
  {:pre  [s, (<= 0 offset (.length s)), text, (<= (+ offset length) (.length s))]
   :post [%]}
  (str (.substring s 0 offset) text (.substring s (+ offset length))))

(defn insert
  "insert what at offset, replacing selection. offset shifted by what's length, selection reset"
  ([{:keys [^String text offset length modifs] :as where :or {modifs []}} ^String what]
    (let [new-offset (+ offset (.length what))]
      (assoc where 
        :text (str-replace text offset length what)
        :offset new-offset
        :length 0
        :modifs (conj modifs {:text what, :offset offset, :length 0})))))

(defn delete
  "removes n chars at offset off. offset not shifted, selection length unchanged"
  ; TODO FIXME : decrease length if now that things are removed, length would make the selection overflow the text
  ; and also adjust :offset if off is before it
  [{:keys [^String text offset length modifs] :as where :or {modifs []}} off n]
  (assoc where 
    :text (str (.substring text 0 off) (.substring text (+ off n)))
    :offset offset
    :modifs (conj modifs {:text "", :offset off, :length n}))) 

(defn shift-offset     
  "shift offset, the selection is also shifted"
  [{:keys [text offset length] :as where} shift]
  (assoc where :offset (+ offset shift))) 

(defn set-offset     
  "sets offset, the selection is also shifted"
  [{:keys [text offset length] :as where} new-offset]
  (assoc where :offset new-offset)) 

; TODO faire comme next-char sur l'utilisation de length
; !! attention pas de gestion de length negative
(defn previous-char-str 
  ([{:keys [^String text offset length] :as t}] (previous-char-str t 1))
  ([{:keys [^String text offset length] :as t} n]
    (assert (>= length 0))
    (when (< -1 (- offset n) (.length text))
      (str (.charAt text (- offset n))))))
  
(defn next-char-str [{:keys [^String text offset length] :as t}]
  (assert (>= length 0))
  (when (< -1 (+ offset length) (.length text))
    (str (.charAt text (+ offset length)))))

(defn line-start 
  "returns the offset corresponding to the start of the line of offset offset in s"
  [^String s offset]
  (loop [offset offset]
    (cond 
      (<= offset 0) 0
      (and (<= offset (.length s)) (= \newline (.charAt s (dec offset)))) offset
      :else (recur (dec offset)))))

(defn line-stop
  "returns the offset corresponding to the end of the line of offset offset in s (excluding carridge return, newline) "
  [^String s offset]
  (let [l (.length s)]
    (loop [offset offset]
      (cond
        (>= offset l) l
        (#{\return \newline} (.charAt s offset)) offset
        :else (recur (inc offset))))))

(defn index-of 
  "Like String.indexOf, but returns nil instead of -1 if not found"
  [^String s c] 
  (let [i (.indexOf s c)] (when-not (neg? i) i)))

(defn full-lines
  "returns a seq of the lines, keeping their end of line chars (as opposed
   to clojure.string/split-lines)"
  [s]
  (lazy-seq
    (when s
      (if-let [i (-?> (index-of s "\n") inc)]
        (cons (.substring s 0 i) (if (= i (.length s)) nil (full-lines (.substring s i))))
        (cons s nil)))))

(deftest line-stop-tests
  (are [expected s o] (= expected (line-stop s o))
    0 "" 0
    1 " " 0
    5 "   a\n" 5
    5 "(\n , \n)" 5
    5 "[a\nb]" 3
    0 "\r\n" 0
    0 "\n" 0
    1 "a\n" 0
    1 "a\n" 1
    ))
