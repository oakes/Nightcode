(ns paredit-widget.core
  (:require [paredit.core]
            [paredit.loc-utils]
            [paredit.parser]
            [paredit.text-utils]
            [seesaw.core :as s])
  (:import [java.awt.event InputMethodListener KeyEvent KeyListener]))

(defn exec-command!
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

(defn insert-result!
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
  {"‚" ")" ;; close and round newline
   "Æ" "\"" ;; meta double quote
   "…" ";"  ;; paredit-commit-dwim
   "∂" "d"  ;; paredit-forward-kill-word
   "·" "(" ;; paredit-wrap-round
   "ß" "s" ;; paredit splice
   "®" "r" ;; raise expr
   "Í" "S" ;; split
   "Ô" "J" ;; join
   })

(def ^:const default-keymap
  {[nil "Tab"] :paredit-indent-line
   [nil "⇥"] :paredit-indent-line
   [nil "Enter"] :paredit-newline
   [nil "⏎"] :paredit-newline})

(def ^:const advanced-keymap
  {[nil "("] :paredit-open-round
   [nil ")"] :paredit-close-round
   [nil "["] :paredit-open-square
   [nil "]"] :paredit-close-square
   [nil "{"] :paredit-open-curly
   [nil "}"] :paredit-close-curly
   [nil "Backspace"] :paredit-backward-delete
   [nil "Delete"] :paredit-forward-delete
   [nil "\""] :paredit-doublequote
   ["C" "9"] :paredit-backward-slurp-sexp
   ["C" "0"] :paredit-forward-slurp-sexp
   ["C" "["] :paredit-backward-barf-sexp
   ["C" "]"] :paredit-forward-barf-sexp
   ["M" "("] :paredit-wrap-round
   ["M" "s"] :paredit-splice-sexp
   ["M" "r"] :paredit-raise-sexp
   ["M" "S"] :paredit-split-sexp
   ["M" "J"] :paredit-join-sexps
   ["M" "Left"] :paredit-expand-left
   ["M" "Right"] :paredit-expand-right})

(def ^:const advanced-alternative-keymap
  {[nil "⌫"] :paredit-backward-delete
   [nil "⌦"] :paredit-forward-delete
   ["C" "Open Bracket"] :paredit-backward-barf-sexp
   ["C" "Close Bracket"] :paredit-forward-barf-sexp
   ["M" "←"] :paredit-expand-left
   ["M" "→"] :paredit-expand-right})

(def ^:const foreign-keymap
  {["M" "["] :paredit-open-square
   ["M" "]"] :paredit-close-square
   ["M" "{"] :paredit-open-curly
   ["M" "}"] :paredit-close-curly})

(def ^:const special-chars
  #{"(" ")" "[" "]" "{" "}" "\""})

(def ^:const ignore-during-selection
  #{:paredit-backward-delete
    :paredit-forward-delete})

(defn exec-paredit!
  [k w buffer enable-default? enable-advanced?]
  (when-let [cmd (or (and enable-default?
                          (default-keymap k))
                     (and @enable-advanced?
                          (or (advanced-keymap k)
                              (advanced-alternative-keymap k)
                              (foreign-keymap k))))]
    (when-not (and (.getSelectedText w)
                   (contains? ignore-during-selection cmd))
      (insert-result! w (exec-command! cmd w buffer))
      cmd)))

(defn convert-key-event
  [event]
  (let [key-code (.getKeyCode event)
        key-char (.getKeyChar event)]
    [(cond
       (and (.isAltDown event) (.isControlDown event)) nil
       (.isAltDown event) "M"
       (.isControlDown event) "C"
       :else nil)
     (if (or (Character/isLetterOrDigit key-char)
             (special-chars (str key-char)))
       (str key-char)
       (KeyEvent/getKeyText key-code))]))

(defn key-event-handler
  [w buffer enable-default? enable-advanced?]
  (reify KeyListener
    (keyReleased [this e] nil)
    (keyTyped [this e]
      (when (and @enable-advanced? (special-chars (str (.getKeyChar e))))
        (.consume e)))
    (keyPressed [this e]
      (when-not (.isConsumed e)
        (let [k (convert-key-event e)
              p (exec-paredit! k w buffer enable-default? enable-advanced?)]
          (when p (.consume e)))))))

(defn convert-input-method-event
  [event]
  ["M" (os-x-charmap (str (.first (.getText event))))])

(defn input-method-event-handler
  [w buffer enable-default? enable-advanced?]
  (reify InputMethodListener
    (inputMethodTextChanged [this e]
      (let [k (convert-input-method-event e)
            p (exec-paredit! k w buffer enable-default? enable-advanced?)]
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
