(ns paredit-widget.core
  (:use [seesaw.core]
        [paredit.core]
        [paredit.parser])
  (:require
        [net.cgrand.parsley :as p]
        [net.cgrand.parsley.functional-trees :as f]
        [net.cgrand.parsley.views :as v])
  (:import java.awt.event.KeyListener
           java.awt.event.InputMethodListener))

(def ^:dynamic *debug* false)

(defn exec-command [cmd widget]
  (let [caretpos (.getCaretPosition widget)
        t (value widget)
        buffer (paredit.parser/edit-buffer nil 0 -1 t)
        parse-tree (paredit.parser/buffer-parse-tree buffer :for-test)]
    (paredit cmd
             {:parse-tree parse-tree :buffer buffer}
             {:text t
              :offset (min (.getSelectionStart widget)
                           (.getCaretPosition widget))
              :length (- (.getSelectionEnd widget)
                         (.getSelectionStart widget) )})))

(defn insert-result [w pe]
  (dorun (map #(if (= 0 (:length %))
            (.insert w (:text %) (:offset %))
            (.replaceRange w (:text %) (:offset %) (+ (:length %) (:offset %))))
          (:modifs pe)))
  (.setCaretPosition w (:offset pe))
  (if (< 0 (:length pe))
    (do
      (.setSelectionStart w (:offset pe))
      (.setSelectionEnd w (+ (:offset pe) (:length pe))))))

(def os-x-charmap
  {"‚" ")" ;;close and round newline
  "Æ" "\"" ;; meta double quote
  "…" ";"  ;; paredit-commit-dwim
  "∂" "d"  ;;paredit-forward-kill-word
  "·" "(" ;; paredit-wrap-round
  "ß" "s" ;;paredit splice
  "®" "r" ;; raise expr
  "Í" "S" ;; split
  "Ô" "J" ;;join
  })

(def keymap
  {
  [nil "(" ] :paredit-open-round
  [nil ")" ] :paredit-close-round
  [nil "[" ] :paredit-open-square
  [nil "]" ] :paredit-close-square
  [nil "{" ] :paredit-open-curly
  [nil "}" ] :paredit-close-curly
  [nil "\b"] :paredit-backward-delete
  [nil  "\t"] :paredit-indent-line
  ["M" ")"] :paredit-close-round-and-newline
  [nil "\""] :paredit-doublequote
  [nil "DEL"] :paredit-forward-delete
  ; ["C" "K"] :paredit-kill not implemented in paredit.clj
  ["M" "("] :paredit-wrap-round
  ["M" "s"] :paredit-splice-sexp
  ["M" "r"] :paredit-raise-sexp
  ["C" "0"] :paredit-forward-slurp-sexp
  ["C" "9"] :paredit-backward-slurp-sexp
  ["C" "Close Bracket"] :paredit-forward-barf-sexp
  ["C" "Open Bracket"] :paredit-backward-barf-sexp
  [nil "\n"] :paredit-newline
  ["M" "S"] :paredit-split-sexp
  ["M" "J"] :paredit-join-sexps
  ["M" "Right"] :paredit-expand-right
  ["M" "Left"] :paredit-expand-left
   })

(declare sexp-dup)

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
  {["M" "f"] :fmt-pprint})

(defn exec-pprint-old [k widget]
  (let [cmd (formatting-keymap k)]
    (if cmd
      (let [fs (with-out-str (clojure.pprint/pprint (read-string (.getSelectedText widget))))]
        (if *debug* (println "replacement: " fs " at: " (.getSelectionStart widget)))
        (if fs (.replaceRange widget fs (.getSelectionStart widget) (.getSelectionEnd widget)))))))

(defn exec-pprint [k widget]
  (let [cmd (formatting-keymap k)]
    (if cmd
      (let [sel (.getSelectedText widget)]
        (if sel (.replaceRange widget (reformat-all-forms sel) (.getSelectionStart widget) (.getSelectionEnd widget)))))))

(defn exec-paredit [k w]
  (let [cmd (keymap k)]
    (if *debug* (println [cmd k]))
    (if cmd
      (let [result (exec-command cmd w)]
        (if *debug* (println [cmd result]))
        (insert-result w result)))
    cmd))

(defn convert-input-method-event [event]
  ["M" (os-x-charmap (str (.first (.getText event))))])

(defn convert-key-event [event]
  (let [
        keyCode (.getKeyCode event)
        keyChar (.getKeyChar event)
        keyText (java.awt.event.KeyEvent/getKeyText keyCode)]

    (if *debug* (println  [event keyCode keyChar keyText]))
    [(cond
      (.isAltDown event) "M"
      (.isControlDown event) "C"
      true nil)
     (if (.isControlDown event)
       keyText
       (if (#{"Left" "Right"} keyText)
         keyText
         (str keyChar)))]))

(defn key-event-handler [w]
  (reify java.awt.event.KeyListener
    (keyReleased [this e] nil)
    (keyTyped [this e]
      (if (#{"(" ")" "[" "]" "{" "}" "\""}
           (str (.getKeyChar e) ))
           (.consume e)))
    (keyPressed [this e]
      (let [k (convert-key-event e)
            p (exec-paredit k w)]
        (if p (.consume e) (exec-pprint k w))))))

(defn input-method-event-handler [w]
  (reify java.awt.event.InputMethodListener
    (inputMethodTextChanged [this e]
      (let [k (convert-input-method-event e)
            p (exec-paredit k w)]
        (if p (.consume e))))))

(defn get-toggle-fn [w]
  (let [key-listener (key-event-handler w)
        input-listener (input-method-event-handler w)]
    (fn [enable?]
      (if enable?
        (doto w
          (.addKeyListener key-listener)
          (.addInputMethodListener input-listener))
        (doto w
          (.removeKeyListener key-listener)
          (.removeInputMethodListener input-listener))))))

(defn paredit-widget [x]
  (let [w (if (string? x)
            (javax.swing.JTextArea. x)
            x)]
    (.addKeyListener w (key-event-handler w))
    (.addInputMethodListener w (input-method-event-handler w))
    w))

(defn test-paredit-widget []
  (native!)
  (->
   (frame :title "Paredit Test"
          :content (config! (paredit-widget "(foo (bar 1))")
                            :size [300 :by 300]))
   pack!
   show!))

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
