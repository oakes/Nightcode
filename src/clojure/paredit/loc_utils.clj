(ns paredit.loc-utils
  (:use paredit.parser)
  (:require [clojure.zip :as zip]))

#_(set! *warn-on-reflection* true)
(defn xml-vzip
  "Returns a zipper for xml elements (as from xml/parse),
  given a root element"
  {:added "1.0"}
  [root]
    (zip/zipper (complement string?) 
            :content
            (fn [node children]
              (assoc node :content children))
            root))

(defn split [cs idx]
  (when cs
    [(subvec cs 0 idx) (cs idx) (subvec cs (inc idx))]))

(defn vdown
  "Returns the loc of the child at index idx of the node at this loc, or
  nil if no children"
  {:added "1.0"}
  [loc idx]
    (when (zip/branch? loc)
      (let [[node path] loc
            [l c r :as cs] (split (zip/children loc) idx)]
        (when cs
          (with-meta [c {:l l
                         :pnodes (if path (conj (:pnodes path) node) [node]) 
                         :ppath path 
                         :r r}] (meta loc))))))

(defn ^:dynamic node-text [n]
  (if (string? n)
    n
    (apply str (map #'node-text (:content n)))))

(defn ^:dynamic loc-text [loc]
  (node-text (zip/node loc)))

(defn loc-count [loc]
 ;(cond
 ;   (nil? loc) 0
 ;   (string? (zip/node loc)) (.length ^String (zip/node loc))
 ;   (zip/down loc) (apply + (map #'loc-count (concat [(zip/down loc)] (zip/rights (zip/down loc)))))
 ;   :else 0))
 (if (zip/branch? loc)
   (or (:count (zip/node loc)) 0) 
   (count (zip/node loc))))

(defn ^String loc-tag [loc]
  (and loc 
    (:tag (zip/node (if (string? (zip/node loc)) (zip/up loc) loc)))))

(defn same-parent? [loc & locs]
  (let [loc-parent-path (butlast (zip/path loc))]
    (every? #(= (butlast (zip/path %)) loc-parent-path) locs)))

(defn loc-depth 
  "returns the depth in the tree of the given loc"
  [loc]
  (count (zip/path loc)))

(defn up-to-depth
  "finds from the loc the ancestor loc at the given depth."
  [loc depth]
  (let [delta (- (loc-depth loc) depth)]
    (cond 
      (zero? delta) loc
      :else (nth (iterate zip/up loc) delta))))

(defn punct-loc?
  "true if the loc corresponds to punctuation."
  [loc]
  (and
    loc
    (string? (zip/node loc)) 
    (not ((conj *atom* :whitespace :comment :char :string :regex) (loc-tag (zip/up loc))))))

(defn root-loc [loc] (if-let [up (zip/up loc)] (recur up) loc))

(defn rlefts
  "like clojure.zip/lefts, but in reverse order (optimized lazy sequence)"
  [loc]
  (rest (take-while identity (iterate zip/left loc))))

(defn next-leaves
  "seq of next leaves locs" ;; TODO correct this aberration: next-leaves includes the current leave ... (or change the name ...)
  [loc]
  (and loc (remove zip/branch? (take-while (complement zip/end?) (iterate zip/next loc)))))

(defn previous-leaves
  "seq of previous leaves locs"
  [loc]
  (and loc (remove zip/branch? (take-while (complement nil?) (iterate zip/prev (zip/prev loc))))))

;; TODO we should be able to locate the offset by first looking at the loc index, 
;; and then get the :content-cumulative-count, etc.
(defn ^:dynamic start-offset [loc]
  (loop [loc loc offset 0] 
    (cond
      (nil? loc) offset
      :else
        (if-let [l (zip/left loc)]
          (recur l (+ offset (loc-count l)))
          (recur (zip/up loc) offset)))))

(defn ^:dynamic end-offset [loc]
  (+ (start-offset loc) (loc-count loc)))

(defn ^:dynamic loc-col [loc]
  (loop [loc (zip/prev loc) col 0]
    (cond
      (nil? loc) 
        col
      (string? (zip/node loc))
        (if (.contains ^String (zip/node loc) "\n")
          (+ col (dec (-> ^String (zip/node loc) (.substring (.lastIndexOf ^String (zip/node loc) "\n")) .length)))
          (recur (zip/prev loc) (+ col (loc-count loc))))
      :else
        (recur (zip/prev loc) col))))
  
(defn loc-parse-node [loc] ; wrong name, and also, will return (foo) if located at ( or at ) ... so definitely wrong name ...
  (if (string? (zip/node loc))
    (zip/up loc)
    loc))

(defn parse-leave
  "returns a leave which corresponds to a parse information: either a (punct-loc?) (beware: a bare String, not a node with meta-data,
   or a parse atom" 
  [loc]
  (cond 
    (punct-loc? loc) loc
    (string? (zip/node loc)) (zip/up loc)
    :else loc))

(defn parse-node
  "transforms the loc in a parse-leave, and if a punct, returns the parent loc"
  [loc]
  (let [loc (parse-leave loc)] 
    (if (punct-loc? loc) (zip/up loc) loc)))

(defn parsed-root-loc
  ([parsed] (parsed-root-loc parsed false))
  ([parsed only-valid?]
    ;(let [valid? (= 1 (-> parsed :accumulated-state count))]
    (xml-vzip parsed)))

(defn ^:dynamic contains-offset?
  "returns the loc itself if it contains the offset, else nil"
  [loc offset]
   (let [start (start-offset loc)
         end (+ (loc-count loc) start)] 
     (and
       (<= start offset (dec end))
       loc)))

(defn leave-loc-for-offset-common
  "returns a zipper location or nil if does not contain the offset"
  [loc offset]
  (if (not (zip/branch? loc))
    (if (< offset (count (zip/node loc))) loc (root-loc loc))
    (let [[cloc offset] 
            (loop [start (int 0) end (int (count (-> loc zip/node :content)))]
              (if (<= end start)
                (if (= start (count (-> loc zip/node :content)))
                  ; no loc found (end of text, will return root-loc instead)
                  (let [last-leave (last 
                                     (take-while 
                                       #(and (zip/branch? %) (zip/children %))
                                       (iterate (comp zip/rightmost zip/down) 
                                                (zip/rightmost loc))))]
                    [last-leave 0])                  
                  
                  [(vdown loc start) (- offset (-> loc zip/node :content-cumulative-count (get start)))])
                (let [n (int (+ start (quot (- end start) 2)))
                      n-offset (-> loc zip/node :content-cumulative-count (get n))
                      n-node (-> loc zip/node :content (get n))
                      n-count (if (string? n-node) (count n-node) (or (:count n-node) 0))] 
                  (cond
                    (< offset n-offset)
                      (recur start (dec n))
                    (< offset (+ n-offset n-count))
                      [(vdown loc n) (- offset n-offset)]
                    :else
                      (recur (inc n) end)))))]
      (if (zero? offset) cloc (recur cloc offset)))))

(defn ^:dynamic leave-for-offset
  [loc offset]
  (if-let [l (leave-loc-for-offset-common loc offset)]
    l
    (root-loc loc)))

(defn ^:dynamic loc-for-offset 
  "returns a zipper location or nil if does not contain the offset"
  [loc offset] 
    (when-let [l (leave-loc-for-offset-common loc offset)]
      (parse-node l)))

(defn ^:dynamic loc-containing-offset
  [loc offset]
  (if-let [l (leave-loc-for-offset-common loc offset)]
    (loop [l l]
      (cond
        (= (root-loc loc) l) l
        (= offset (start-offset l)) (recur (zip/up l))
        :else l))
    (root-loc loc)))

(defn start-punct?
  "true if the loc is a punct starting a form"
  [loc]
  (and
    (punct-loc? loc)
    (= (start-offset loc) (start-offset (parse-node loc)))))

(defn end-punct?
  "true if the loc is a punct ending a form"
  [loc]
  (and
    (punct-loc? loc)
    (= (end-offset loc) (end-offset (parse-node loc)))))
