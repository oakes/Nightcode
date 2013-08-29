(ns paredit.parser
  (:refer-clojure :exclude [partition])
  (:use clojure.test)
  (:use [clojure.core.incubator :only [-?>]])
  (:use paredit.regex-utils)
	(:require [clojure.zip :as zip])
  (:require [net.cgrand.parsley :as p])
  (:require [net.cgrand.parsley.lrplus :as lr+])
  (:require [clojure.string :as str]))

#_(set! *warn-on-reflection* true)

(def ^:dynamic *brackets-tags* #{:list :map :vector :string :set :fn :regex})
(def ^:dynamic *tag-closing-brackets* {:list ")", :map "}", :vector "]", :string "\"", :regex "\"", :set "}", :fn ")"})
(def ^:dynamic *tag-opening-brackets* {:list "(", :map "{", :vector "[", :string "\"", :regex "#\"", :set "#{", :fn "#("})
(def ^:dynamic *atom* #{:symbol :keyword :int :float :ratio :anon-arg})

(def eof (reify net.cgrand.parsley.lrplus/MatcherFactory
           (matcher-fn [this id]
             (fn [s eof?] (when (and (= 0 (.length ^String s)) eof?) [0 id])))))

(def gspaces #{:whitespace :comment :discard})
(def only-code (partial remove (comp (conj gspaces 
                                           :meta-prefix
                                           :deprecated-meta-prefix) 
                                     :tag)))

(defn code-children 
  [e] 
  (only-code (:content e)))

(defn remove-meta 
  "removes the meta(s) to get to the form"
  [e]
  (if (not= :meta (:tag e))
    e
    (recur (first (code-children e)))))

(defn ^:deprecated form 
  "DEPRECATED - use remove-meta instead - removes the meta(s) to get to the form" 
  [e] (remove-meta e))

(defn sym-name
  "returns the symbol name" 
  [e] 
  (let [e (remove-meta e)]
    (and (#{:symbol} (:tag e)) (apply str (:content e)))))

(defn called 
  "If e is a function call, return the called symbol name"
  [e] 
  (let [e (remove-meta e)
        e-code-children (code-children e)]
    (and 
      (<= 2 (count e-code-children))
      (#{"("} (nth e-code-children 0))
      (sym-name (nth e-code-children 1)))))

(defn call-of 
  "Is form e a call to c?
   Return e"
  [e c] 
  (let [e (remove-meta e)]
    (and 
      (#{c} (called e)) 
      e)))

(defn call-args
  [e]
  (-> (code-children e) nnext butlast))



;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; MAKE-NODE, VIEWS, ETC.

(defmacro memoized-fn [name args & body]
  `(let [a# (atom {})]
     (fn ~name ~args
       (let [m# @a#
             args# ~args]
         (if-let [[_# v#] (find m# args#)]
           v#
           (let [v# (do ~@body)]
             (swap! a# assoc args# v#)
             v#))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;


(defn root-node-tag?
  "Temporary hack until parsley correctly generates root node tags from incremental buffer"
  [t]
  (= :root 
     (when t (-> t name keyword))))

(def open-list "(")
(def open-vector "[")
(def open-map "{")
(def open-set "#{")
(def open-quote \')
(def open-meta "^")
(def open-deref \@)         ;"#(?:[\{\(\'\^\"\_\!])" 
(def open-syntax-quote \`)
(def open-fn "#(")
(def open-var "#'")
(def open-deprecated-meta "#^")
(def open-string \")
(def open-regex "#\"")
(def open-unquote-splicing "~@")
(def open-unquote #"~(?!@)")
(def open-anon-arg "%")
(def open-keyword #":{1,2}")
(def open-discard "#_")
(def whitespace #"(?:,|\s)+")
(def open-comment #"(?:\#\!|;)")
(def open-reader-literal #"#(?![\(\^\"\{\'\_\!])")
(def open-char "\\")
(def symbol-exclusion #"[^\(\[\#\{\\\"\~\%\:\,\s\!\;\'\@\`;0-9]")
(def ^{:private true} prefixes
  #{open-list open-vector open-map open-set open-quote 
    open-meta open-deprecated-meta open-deref open-syntax-quote
    open-fn open-var open-string open-regex open-unquote-splicing
    open-unquote open-anon-arg open-keyword open-discard whitespace open-comment
    open-char})

(defn view-children-seq [view abstract-children]
  (map #(% view) abstract-children))

(defn view-children-vec [view abstract-children]
  (persistent! (reduce 
                 #(conj! %1 (%2 view))
                 (transient [])
                 abstract-children)))

(defn- children-info [parse-tree-children]
  (let [red (reduce
              (fn [acc child]
                (let [child-count (if (string? child) (count child) (:count child 0))]
                  (conj acc (+ (peek acc) child-count))))
              [0] 
              parse-tree-children)]
    [(pop red) (peek red)]))

(def ^:dynamic *build-id*)

(defn parse-tree-view 
  ([abstract-leaf s] s) 
  ([abstract-node t abstract-children]
    (let [parse-tree-children  (view-children-vec parse-tree-view abstract-children)]
      (let [[combined count] (children-info parse-tree-children)]
        {:tag t
         :content parse-tree-children
         :build-id *build-id*
         :count count
         :content-cumulative-count combined
         :abstract-node abstract-node
         :broken? (or (#{::unexpected :chimera} t)
                      (some #{::unexpected :chimera} (cons t (map :tag parse-tree-children)))
                      false)
         ;:tokens (tokens t parse-tree-children count)
         }))))

(defn node-count [abstract-node]
  (let [ptv (abstract-node parse-tree-view)]
    (if (string? ptv)
      (.length ^String ptv)
      (:count ptv))))

(def ^{:private true} nesting-tags #{:list, :fn, :chimera}) ;; TODO :chimera is imprecise, one should also see if it's "#(" or "("

(defn- token-length [x]
  (cond (string? x) (.length ^String x)
        (map? x) (:token-length x)
        (number? x) x
        :else (throw (RuntimeException. (str "invalid token for token-length:" "'" x "'")))))

(defn- token
  ([token-type] (token token-type ""))
  ([token-type text] (list {:token-type token-type :token-length (token-length text)})))

(declare tokens-view)

(defn- balanced [token-open token-close abstract-children]
  (concat (token token-open (node-count (get abstract-children 0))) 
          (mapcat identity (view-children-seq tokens-view (next (pop abstract-children))))
          (token token-close (node-count (peek abstract-children)))))

(defn- unbalanced [token-open abstract-children]
  (concat (token token-open (node-count (get abstract-children 0)))
          (mapcat identity (view-children-seq tokens-view (next abstract-children)))))

(defn- tokens [t abstract-children count] 
  ;(println "type: " (type abstract-children))
  ;(println "abstract-children:" abstract-children)
  (cond
    (= :whitespace t) (token :whitespace count)
    (= :space t) (token :whitespace count) ; TODO one of this and the above is irrelevant. Which one ?
    (= :list t) (concat (token :nest 0) (balanced :open-list :close-list abstract-children) (token :unnest 0))
    (= :vector t) (balanced :open :close-vector abstract-children)
    (= :map t) (balanced :open :close-map abstract-children)
    (= :set t) (balanced :open :close-set abstract-children)
    (= :quote t) (unbalanced :open abstract-children)
    ;(= :meta t) (unbalanced :open abstract-children)
    (#{:meta :deprecated-meta} t)
      (let [[meta & rest] abstract-children]
        (concat (token :meta (node-count meta))
                (mapcat identity (view-children-seq tokens-view rest)))) 
    (= :reader-literal t) (let [body (peek abstract-children)]
                            (concat (token :reader-literal (- count (node-count body)))
                                    (body tokens-view)
                                    ;(mapcat identity (view-children-seq tokens-view (pop abstract-children)))
                                    ))
    #_(let [abstract-children (mapcat identity abstract-children)]
                  ;(print "(tokens) (:meta) abstract-children:") (prn abstract-children)
                  ;(print "(get abstract-children 0):") (prn (first abstract-children))
                  ;(print "(get abstract-children 1):") (prn (second abstract-children))
                  (concat (token :meta (+ (token-length (first abstract-children))
                                          (token-length (second abstract-children)))) 
                          (next (next abstract-children))))
    (= :deref t) (unbalanced :open-deref abstract-children)
    (= :syntax-quote t) (unbalanced :open abstract-children) 
    (= :var t) (unbalanced :open-var abstract-children)
    (= :fn t) (concat (token :nest 0) (balanced :open-fn :close-fn abstract-children) (token :unnest 0))
    (= :unquote-splicing t) (unbalanced :open abstract-children)
    (= :unquote t) (unbalanced :open abstract-children)
    (= :string t) (token :string count)
    (= :regex t) (token :regex count)
    (= :symbol t) (let [s ((get abstract-children 0) parse-tree-view)] 
                    (if (#{"nil" "true" "false"} s)
                      (token :other-literals count)
                      (token :symbol count)))
    (= :keyword t) (token :keyword count)
    (= :int t) (token :int count)
    (= :float t) (token :float count)
    (= :ratio t) (token :ratio count)
    (= :anon-arg t) (token :anon-arg count)
    (= :char t) (token :char count)
    (= :chimera t) (cond
                     (= "\"" ((get abstract-children 0) parse-tree-view))
                       (token :string count)
                     (= "#\"" ((get abstract-children 0) parse-tree-view))
                       (token :regex count)
                     :else
                       (concat (token :nest 0) (balanced :open-chimera :close-chimera abstract-children) (token :unnest 0)))
    (= :comment t) (token :comment count)
    (= :discard t) (token :comment count)
    (= :net.cgrand.parsley/root t) (concat (mapcat identity (view-children-seq tokens-view abstract-children)) (token :eof))
    :else (token :unexpected count)))

(defn tokens-view
  ([abstract-leaf s] (do ;(print "(tokens-view) abstract-leaf:") (prn (list s)) 
                       (throw (RuntimeException. (str "argh: s='" s "'"))) (token :unexpected (.length ^String s))))
  ([abstract-node t abstract-children]
    ;(print "(tokens-view) abstract-children:") (prn abstract-children)
    (tokens t abstract-children (node-count abstract-node))))

#_(defn hippie-view
  ([abstract-leaf s] nil)
  ([abstract-node t abstract-children]
    (letfn [(proposals [abstract-node pos]
              (let [t (-> (abstract-node parse-tree-view) :content (get pos))]
                #{t (str ":" t)}))]
      (cond
        (= :symbol t) (proposals abstract-node 0) 
        (= :keyword t) (proposals abstract-node 1)
        :else (let [child-views (map #(% hippie-view) abstract-children)]
                (reduce into #{} child-views))))))

(defn- proposals [abstract-node pos]
  (-> (abstract-node parse-tree-view) :content (get pos)))

(defn hippie-symbol-view
  ([abstract-leaf s] nil)
  ([abstract-node t abstract-children]
    (cond
      (= :symbol t) #{(proposals abstract-node 0)} 
      (= :keyword t) #{(proposals abstract-node 1)}
      :else (let [child-views (map #(% hippie-symbol-view) abstract-children)]
              (reduce into #{} child-views)))))

(defn hippie-keyword-view
  ([abstract-leaf s] nil)
  ([abstract-node t abstract-children]
    (cond
      (= :keyword t) #{(str ":" (proposals abstract-node 1))}
      :else (let [child-views (map #(% hippie-keyword-view) abstract-children)]
              (reduce into #{} child-views)))))

#_(defn nesting-level-view
  [abstract-node t abstract-children]
  (fn [context] 
    (if (get nesting-tags t)
      (inc context)
      context)))

#_(defn enhanced-tokens-view
  [abstract-node t abstract-children]
  (fn [context]
    (let [new-context ((abstract-node nesting-level-view) context)
          context-change (not= context new-context)]
      (concat (command :nest-level new-context)
              ((chilren-views abstract-children enhanced-tokens-view) new-context)
              (command :nest-level context)))
    (tokens t parse-tree-children)))

#_(defn coarse-damage-view
  [abstract-node t abstract-children]
  (let [parse-tree-node (abstract-node parse-tree-view)
        _               (do (println "parse-tree-node: ") parse-tree-node)
        node-build-id (:build-id parse-tree-node)
        offsets (mapcat (fn [child offset]
                          (when (= node-build-id (:build-id child))
                            [offset (+ offset (:count child))]))
                        (:content parse-tree-node)
                        (:content-cumulative-count parse-tree-node))]
    (when (seq offsets) [(first offsets) (last offsets)])))

(defn make-leaf [s]
  (memoized-fn abstract-leaf
    [view]
      (view abstract-leaf s)))

(defn make-node [t abstract-children]
  (memoized-fn abstract-node
    [view]
    (view abstract-node t abstract-children)))

(defn- make-unexpected [s]
  (make-node ::unexpected [(make-leaf s)]))

(def sexp
  (p/parser {:root-tag :root
           :main :expr*
           :space (p/unspaced gspaces :*)
           :make-node make-node
           :make-leaf make-leaf
           :make-unexpected make-unexpected
           }
    :expr- #{
             :list
             :vector
             :map
             :set
             :quote
             :meta
             :deprecated-meta
             :deref
             :syntax-quote
             :var
             :fn
             :unquote-splicing
             :unquote
             :string
             :regex
             :symbol 
             :reader-literal
             :keyword 
             :int 
             :float 
             :ratio 
             :anon-arg
             :char
             :chimera
             }
    :list [open-list :expr* ")"]
    :chimera 
             #{ 
               [open-list :expr* eof] 
               [open-vector :expr* eof]
               [open-map :expr* eof]
               [open-fn :expr* eof]
               [open-set :expr* eof]
               ;(p/unspaced open-string #"(?:\\.|[^\\\"])++(?!\")" :? eof)
               ;(p/unspaced open-regex #"(?:\\.|[^\\\"])++(?!\")" :? eof)
               [open-quote eof]
               [open-deref eof]
               [open-syntax-quote eof]
               [open-var eof]
               [open-discard eof]
               [open-unquote-splicing eof]
               [open-unquote eof]
               (p/unspaced open-char eof)
               }
    :vector [open-vector :expr* "]"]
    :map [open-map :expr* "}"]
    :set [open-set :expr* "}"]
    :quote [open-quote :expr]
    :open-meta "^"             :open-deprecated-meta "#^"
    :meta-prefix [:open-meta 
                  :expr]       :deprecated-meta-prefix [:open-deprecated-meta 
                                                        :expr]
    :meta [:meta-prefix :expr] :deprecated-meta [:deprecated-meta-prefix 
                                                 :expr]
    :deref [open-deref :expr]
    :syntax-quote [open-syntax-quote :expr]
    :var [open-var :expr]
    :fn [open-fn :expr* ")"]
    :unquote-splicing [open-unquote-splicing :expr]
    :unquote [open-unquote :expr]
    :string-body #"(?:\\.|[^\\\"])++(?=\")"
    :string (p/unspaced open-string :string-body :? \")
    :regex-body #"(?:\\.|[^\\\"])++(?=\")"
    :regex (p/unspaced open-regex :regex-body :? \")
    :reader-literal-prefix (p/unspaced open-reader-literal :symbol)
    :reader-literal [:reader-literal-prefix :expr]
    :symbol
;      #"(?:[\-\+](?![0-9])[^\^\(^\[^\#^\{^\\^\"^\~^\%^\:^\,^\s^\;^\@^\`^\)^\]^\}]*)|(?:[^\^\(\[^\#\{\\\"\~\%\:\,\s\;\'\@\`\)\]\}\-\+;0-9][^\^\(\[\#\{\\\"\~\%\:\,\s\;\@\`\)\]\}]*|#(?![\{\(\'\^\"\_\!])[^\^\(\[\#\{\\\"\~\%\:\,\s\;\'\@\`\)\]\}]*)#?"
      #"(?:(?:[\-\+](?![0-9])[^\^\(^\[^\#^\{^\\^\"^\~^\%^\:^\,^\s^\;^\@^\`^\)^\]^\}]*)|(?:[^\^\(\[^\#\{\\\"\~\%\:\,\s\;\'\@\`\)\]\}\-\+;0-9][^\^\(\[\#\{\\\"\~\%\:\,\s\;\@\`\)\]\}]*))#?"
    :keyword (p/unspaced open-keyword #"[^\(\[\{\'\^\@\`\~\"\\\,\s\;\)\]\}]*"); factorize with symbol
    :int #"(?:[-+]?(?:0(?!\.)|[1-9][0-9]*+(?!\.)|0[xX][0-9A-Fa-f]+(?!\.)|0[0-7]+(?!\.)|[1-9][0-9]?[rR][0-9A-Za-z]+(?!\.)|0[0-9]+(?!\.))(?!/))"
    :ratio #"[-+]?[0-9]+/[0-9]*"
    :float #"[-+]?[0-9]+\.[0-9]*+(?:[eE][-+]?+[0-9]+)?+M?"
    :anon-arg (p/unspaced open-anon-arg #"(?:[0-9|\&])?+")
    :char (p/unspaced open-char #"(?:newline|space|tab|backspace|formfeed|return|u[0-9|a-f|A-F]{4}|o[0-3]?+[0-7]{1,2}|.)")
    :whitespace whitespace
    :comment #{(p/unspaced open-comment #"[^\n]*\n?")} 
    :discard [open-discard :expr]
    ))

(defn edit-buffer [buffer offset len text]
  ;(println (str "------- edit buffer:" " offset=" offset ", len=" len ", text='" text "'"))
  (let [text (or text "")]
    (if (= [0 -1] [offset len])
      (p/edit (p/incremental-buffer sexp) 0 0 text)
      (p/edit (or buffer (p/incremental-buffer sexp)) offset len text))))

(defn buffer-parse-tree [buffer build-id]
  (binding [*build-id* build-id]
    ((p/parse-tree buffer) parse-tree-view)))

(defn parse
  ([^String text]
    (buffer-parse-tree (edit-buffer nil 0 -1 text) 0))
  ([^String text offset]
    (throw (RuntimeException. "deprecated arity")) #_(sexp text)))

;; TODO rendre deprecated ...
(defn parse-tree
  [state]
  state)

(defn pretty [parse]
  (if (map? parse)
    (into [] (cons (:tag parse) (map pretty (:content parse))))
    parse))

(comment 
(require '[net.cgrand.parsley.lrplus :as l])
(require '[net.cgrand.parsley.fold :as f])
(require '[paredit.loc-utils :as lu])
(let [c (slurp "C:\\Users\\Laurent\\Downloads\\1.3.0-alpha6\\src\\clj\\clojure\\core.clj")]

  (dotimes [_ 10] (do
                    (println "==== Executing full parser:")
                    (let [parse-tree (time (parse c))] 
                      (println "full parser's  tokens first and second walks:")
                      (dotimes [_ 2] (time (dorun ((:abstract-node parse-tree) tokens-view)))))))
  (println "==========================")
  (dotimes [_ 10] (do
                    (println "==== Executing parser incrementally:")
                    (let [parse-tree (time (-> (edit-buffer nil 0 0 c) (buffer-parse-tree 0)))] 
                      (println "incremental full parser's  tokens first and second walks:")
                      (dotimes [_ 2] (time (dorun ((:abstract-node parse-tree) tokens-view)))))))
  (println "==========================")
  (println "Test edit incremental")
  (dotimes [_ 10]
    (let [b (let [_ (println "==== initial incremental buffer")
                  b (time (edit-buffer nil 0 0 c))
                  _ (println "initial parse-tree")
                  _ (time (buffer-parse-tree b 0))
                  _ (println "parse-tree via the function, again (should be instantaneous)")
                  pt (time (buffer-parse-tree b 0))
                  _ (println "tokens first walk:")
                  _ (time (dorun ((:abstract-node pt) tokens-view)))
                  _ (println "tokens second walk:")
                  _ (time (dorun ((:abstract-node pt) tokens-view)))]
              b)
          b (let [_ (println "==== add '(\\n' before the top comment")
                  b (time (-> b (edit-buffer 0 0 "(\n"))) 
                  _ (println "parse-tree after add '(\\n' before the top comment")
                  _ (time (buffer-parse-tree b 0))
                  _ (println "parse-tree via the function, again (should be instantaneous)")
                  pt (time (buffer-parse-tree b 0))
                  _ (time (dorun ((:abstract-node pt) tokens-view)))
                  _ (println "tokens second walk:")
                  _ (time (dorun ((:abstract-node pt) tokens-view)))]
              b)]
      b))
  (= c (lu/node-text (-> (edit-buffer nil 0 0 c) (buffer-parse-tree 0))) (lu/node-text (parse c)))))

