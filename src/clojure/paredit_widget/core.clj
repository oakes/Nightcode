(ns paredit-widget.core
  (:require [paredit.core]
            [paredit.loc-utils]
            [paredit.parser]
            [paredit.text-utils]
            [paredit-widget.format :as format]
            [seesaw.core :as s])
  (:import java.awt.event.KeyListener
           java.awt.event.InputMethodListener))

(def ^:dynamic *debug* false)

(defn exec-command [cmd widget buffer]
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

(defn exec-paredit [k w buffer]
  (when-let [cmd (keymap k)]
    (if *debug* (println [cmd k]))
    (let [result (exec-command cmd w buffer)]
      (if *debug* (println [cmd result]))
      (insert-result w result))
    cmd))

(defn convert-input-method-event [event]
  ["M" (os-x-charmap (str (.first (.getText event))))])

(defn convert-key-event [event]
  (let [key-code (.getKeyCode event)
        key-char (.getKeyChar event)
        key-text (java.awt.event.KeyEvent/getKeyText key-code)]
    (if *debug* (println  [event key-code key-char key-text]))
    [(cond
      (.isAltDown event) "M"
      (.isControlDown event) "C"
      true nil)
     (if (.isControlDown event)
       key-text
       (if (#{"Left" "Right"} key-text)
         key-text
         (str key-char)))]))

(defn key-event-handler [w buffer]
  (reify java.awt.event.KeyListener
    (keyReleased [this e] nil)
    (keyTyped [this e]
      (if (#{"(" ")" "[" "]" "{" "}" "\""}
           (str (.getKeyChar e) ))
           (.consume e)))
    (keyPressed [this e]
      (let [k (convert-key-event e)
            p (exec-paredit k w buffer)]
        (if p (.consume e) (format/exec-format k w))))))

(defn input-method-event-handler [w buffer]
  (reify java.awt.event.InputMethodListener
    (inputMethodTextChanged [this e]
      (let [k (convert-input-method-event e)
            p (exec-paredit k w buffer)]
        (if p (.consume e))))))

(defn get-toggle-fn [w]
  (let [buffer (atom (paredit.parser/edit-buffer nil 0 -1 (s/value w)))
        key-listener (key-event-handler w buffer)
        input-listener (input-method-event-handler w buffer)]
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
            x)
        toggle-fn (get-toggle-fn w)]
    (toggle-fn true)
    w))

(defn test-paredit-widget []
  (s/native!)
  (-> (s/frame :title "Paredit Test"
               :content (s/config! (paredit-widget "(foo (bar 1))")
                                   :size [300 :by 300]))
      s/pack!
      s/show!))
