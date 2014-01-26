(ns paredit-widget.core
  (:require [paredit.core]
            [paredit.loc-utils]
            [paredit.parser]
            [paredit.text-utils]
            [paredit-widget.format :as format]
            [seesaw.core :as s])
  (:import [java.awt.event InputMethodListener KeyEvent KeyListener]))

(defn exec-command
  [cmd widget buffer]
  (let [old-parse-tree (paredit.parser/buffer-parse-tree @buffer nil)
        old-text (paredit.loc-utils/node-text old-parse-tree)
        new-text (s/value widget)
        diff (paredit.text-utils/text-diff old-text new-text)
        new-buffer (->> [@buffer (:offset diff) (:length diff) (:text diff)]
                        (apply paredit.parser/edit-buffer)
                        (reset! buffer))
        new-parse-tree (paredit.parser/buffer-parse-tree new-buffer nil)]
    (paredit.core/paredit cmd
                          {:parse-tree new-parse-tree :buffer new-buffer}
                          {:text new-text
                           :offset (min (.getSelectionStart widget)
                                        (.getCaretPosition widget))
                           :length (- (.getSelectionEnd widget)
                                      (.getSelectionStart widget))})))

(defn insert-result
  [w pe]
  (dorun
    (map #(if (= 0 (:length %))
            (.insert w (:text %) (:offset %))
            (.replaceRange w (:text %) (:offset %) (+ (:length %) (:offset %))))
         (:modifs pe)))
  (.setCaretPosition w (:offset pe))
  (when (< 0 (:length pe))
    (.setSelectionStart w (:offset pe))
    (.setSelectionEnd w (+ (:offset pe) (:length pe)))))

(def ^:const os-x-charmap
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

(def ^:const default-keymap
  {[nil "\t"] :paredit-indent-line
   [nil "\n"] :paredit-newline})

(def ^:const advanced-keymap
  {[nil "("] :paredit-open-round
   [nil ")"] :paredit-close-round
   [nil "["] :paredit-open-square
   [nil "]"] :paredit-close-square
   [nil "{"] :paredit-open-curly
   [nil "}"] :paredit-close-curly
   [nil "\b"] :paredit-backward-delete
   [nil "\""] :paredit-doublequote
   [nil "DEL"] :paredit-forward-delete
   ; ["C" "K"] :paredit-kill
   ["M" "("] :paredit-wrap-round
   ; ["M" ")"] :paredit-close-round-and-newline
   ["M" "s"] :paredit-splice-sexp
   ["M" "r"] :paredit-raise-sexp
   ["C" "0"] :paredit-forward-slurp-sexp
   ["C" "9"] :paredit-backward-slurp-sexp
   ["C" "Close Bracket"] :paredit-forward-barf-sexp
   ["C" "Open Bracket"] :paredit-backward-barf-sexp
   ["M" "S"] :paredit-split-sexp
   ["M" "J"] :paredit-join-sexps
   ["M" "Right"] :paredit-expand-right
   ["M" "Left"] :paredit-expand-left})

(defn exec-paredit
  [k w buffer enable-default? enable-advanced?]
  (when-let [cmd (or (and enable-default? (default-keymap k))
                     (and @enable-advanced? (advanced-keymap k)))]
    (let [result (exec-command cmd w buffer)]
      (insert-result w result))
    cmd))

(defn convert-input-method-event
  [event]
  ["M" (os-x-charmap (str (.first (.getText event))))])

(defn convert-key-event
  [event]
  (let [key-code (.getKeyCode event)
        key-char (.getKeyChar event)]
    [(cond
       (and (.isAltDown event) (.isControlDown event)) nil
       (.isAltDown event) "M"
       (.isControlDown event) "C"
       :else nil)
     (if (= KeyEvent/CHAR_UNDEFINED key-char)
       (KeyEvent/getKeyText key-code)
       (str key-char))]))

(defn key-event-handler
  [w buffer enable-default? enable-advanced?]
  (reify KeyListener
    (keyReleased [this e] nil)
    (keyTyped [this e]
      (when (and @enable-advanced?
                 (get #{"(" ")" "[" "]" "{" "}" "\""}
                      (str (.getKeyChar e))))
        (.consume e)))
    (keyPressed [this e]
      (when-not (.isConsumed e)
        (let [k (convert-key-event e)
              p (exec-paredit k w buffer enable-default? enable-advanced?)]
          (if p (.consume e) (format/exec-format k w)))))))

(defn input-method-event-handler
  [w buffer enable-default? enable-advanced?]
  (reify InputMethodListener
    (inputMethodTextChanged [this e]
      (let [k (convert-input-method-event e)
            p (exec-paredit k w buffer enable-default? enable-advanced?)]
        (when p (.consume e))))))

(defn init-paredit!
  [w enable-default?]
  (let [buffer (atom (paredit.parser/edit-buffer nil 0 -1 (s/value w)))
        enable-advanced? (atom true)]
    (doto w
      (.addKeyListener
        (key-event-handler w buffer enable-default? enable-advanced?))
      (.addInputMethodListener
        (input-method-event-handler w buffer enable-default? enable-advanced?)))
    (fn [enable?]
      (reset! enable-advanced? enable?))))
