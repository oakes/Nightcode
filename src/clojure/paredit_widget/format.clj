(ns paredit-widget.format
  (:require [net.cgrand.parsley :as p]
            [net.cgrand.parsley.functional-trees :as f]
            [net.cgrand.parsley.views :as v]
            [paredit.parser :refer :all]))

(def sexp-dup
  (p/parser {:root-tag :root
           :main :expr*
           :space (p/unspaced gspaces :*)
           :make-node f/fnode
           :make-leaf f/fleaf
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
    :symbol #"(?:(?:[\-\+](?![0-9])[^\^\(^\[^\#^\{^\\^\"^\~^\%^\:^\,^\s^\;^\@^\`^\)^\]^\}]*)|(?:[^\^\(\[^\#\{\\\"\~\%\:\,\s\;\'\@\`\)\]\}\-\+;0-9][^\^\(\[\#\{\\\"\~\%\:\,\s\;\@\`\)\]\}]*))#?"
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

(defn format-code [string]
  (loop [s string col 0 dstack [] out [] space nil incl false
         insl false incm false lwcr false sups true cmindent nil]
    (if-let [c (first s)]
      (let [r (rest s)
            begins "([{"
            ends ")]}"
            delim-indents (zipmap begins [1 0 0])
            delim-ends (zipmap ends begins)
            sups-char? #{\' \` \~ \@ \#}
            indent (fn []
                     (if (or (empty? r) (empty? dstack))
                       [\newline]
                       (into [\newline]
                         (repeat
                           (let [[delim pos] (peek dstack)]
                             (+ pos (delim-indents delim)))
                           \space))))
            conc (fn [c]
                   (if sups [c] (conj space c)))
            pop-d (fn [stack c]
                    (if (empty? stack)
                      []
                      (let [ps (pop stack)]
                        (if (empty? ps)
                          []
                          (if (= (first (peek stack)) (delim-ends c))
                            ps
                            (recur ps c))))))]
        (cond
          incm (let [nl (or (= c \newline) (= c \return))
                     spc (Character/isWhitespace c)
                     cc (if nl
                          (indent)
                          (if spc
                            (if-not sups [c])
                            [c]))]
                 (recur
                   r (if nl (dec (count cc)) (+ col (count cc)))
                   dstack (into out cc) nil false false
                   (if-not nl incm) (= c \return) nl cmindent))
          (= c \") (let [cc (if (or incl insl) [c] [\space c])]
                     (recur
                       r (+ col (count cc)) dstack (into out cc)
                       (if (and insl (not incl)) [\space]) false
                       (if incl insl (not insl)) false false false
                       cmindent))
          (or incl insl) (recur
                           r (if (or (= c \newline) (= c \return))
                               0
                               (inc col))
                           dstack (conj out c) nil
                           (and insl (not incl) (= c \\)) insl false
                           false false cmindent)
          (= c \;) (let [padding (if sups 0 1)
                         padding (if cmindent
                                   (max padding (- cmindent col))
                                   padding)
                         padding (repeat padding \space)
                         padding (concat padding [\; \space])]
                     (recur
                       r (+ col (count padding)) dstack
                       (into out padding) nil false false true false
                       true (+ col (count padding) -2)))
          (= c \\) (let [cc (if sups [c] [\space c])]
                     (recur
                       r (+ col (count cc)) dstack (into out cc) nil
                       true false false false false cmindent))
          (or
            (and (= c \newline) (not lwcr))
            (= c \return)) (let [i (indent)]
                             (recur
                               r (dec (count i)) dstack (into out i)
                               nil false false false (= c \return)
                               true nil))
          (= c \newline) (recur
                           r col dstack out nil false false false
                           false true cmindent)
          (Character/isWhitespace c) (recur
                                       r col dstack out [\space]
                                       false false false false sups
                                       cmindent)
          (delim-indents c) (let [cc (if sups [c] [\space c])
                                  cn (count cc)]
                              (recur
                                r (+ col cn)
                                (conj dstack [c (+ col cn)])
                                (into out cc) nil false false false
                                false true cmindent))
          (delim-ends c) (recur
                           r (inc col) (pop-d dstack c) (conj out c)
                           [\space] false false false false false
                           cmindent)
          :else (let [cc (conc c)]
                  (recur
                    r (+ col (count cc)) dstack (into out cc) nil
                    false false false false (sups-char? c)
                    cmindent))))
      (apply str out))))

(defn reformat-all-forms [s] 
  (let [rvec (map (fn [[offs p]]
                    (let [len (v/length p)]
                      (vector (- offs len) len (.trim (with-out-str (clojure.pprint/with-pprint-dispatch clojure.pprint/code-dispatch (clojure.pprint/pprint (read-string (v/text p)))))))))
                  (filter (fn [me] (= :list (v/tag (val me)))) (v/offsets (sexp-dup s))))
          ;_ (println "rvec: " rvec)
          first-offset (first (first rvec))
          first-len (second (first rvec))
          first-s (last (first rvec))
          ;_ (println "partitioned: " (partition 2 1 rvec))
          rlist (partition 2 1 rvec)
          ;_ (println "rlist: " rlist)
          sb (StringBuffer. s)
          first-diff (- (.length first-s) first-len)
        ]
          ; replace first form
          (.replace sb first-offset (+ first-offset first-len) first-s)

          ; replace from 2nd to last form
          (loop [diff-offset first-diff
                 rl rlist]
            (if (empty? rl)
              (.toString sb)
              (let [ra (first (first rl))
                    rb (second (first rl))
                    ;_ (println "ra: " ra)
                    ;_ (println "rb: " rb)
                    diff-offset-next (- (.length (last ra)) (second ra))
                    diff-sum (+ diff-offset diff-offset-next)
                    offset-b (+ (first rb) diff-sum)
                    len-b (second rb)]

                      ; replace next form
                      (.replace sb offset-b (+ offset-b len-b) (last rb))
                      (recur diff-sum (rest rl)))))))

(def formatting-keymap
  {["M" "p"] :fmt-pprint ["M" "f"] :fmt-plain})

(defn exec-format [k widget]
  (let [cmd (formatting-keymap k)]
    (if cmd
      (let [sel (.getSelectedText widget)]
        (when sel
        (cond
          (= cmd :fmt-pprint) 
            (.replaceRange widget (reformat-all-forms sel) (.getSelectionStart widget) (.getSelectionEnd widget))
          (= cmd :fmt-plain)
            (.replaceRange widget (format-code sel) (.getSelectionStart widget) (.getSelectionEnd widget))))))))
