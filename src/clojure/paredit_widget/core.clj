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
  (dorun
    (map #(if (= 0 (:length %))
            (.insert w (:text %) (:offset %))
            (.replaceRange w (:text %) (:offset %) (+ (:length %) (:offset %))))
         (:modifs pe)))
  (.setCaretPosition w (:offset pe))
  (when (< 0 (:length pe))
    (.setSelectionStart w (:offset pe))
    (.setSelectionEnd w (+ (:offset pe) (:length pe)))))

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

(defn exec-paredit [k w buffer enable?]
  (when-let [cmd (or (default-keymap k)
                     (and @enable? (advanced-keymap k)))]
    (when *debug* (println [cmd k]))
    (let [result (exec-command cmd w buffer)]
      (when *debug* (println [cmd result]))
      (insert-result w result))
    cmd))

(defn convert-input-method-event [event]
  ["M" (os-x-charmap (str (.first (.getText event))))])

(defn convert-key-event [event]
  (let [key-code (.getKeyCode event)
        key-char (.getKeyChar event)
        key-text (java.awt.event.KeyEvent/getKeyText key-code)]
    (when *debug* (println [event key-code key-char key-text]))
    [(cond
       (.isAltGraphDown event) nil
       (.isAltDown event) "M"
       (.isControlDown event) "C"
       :else nil)
     (if (.isControlDown event)
       key-text
       (if (get #{"Left" "Right"} key-text)
         key-text
         (str key-char)))]))

(defn key-event-handler [w buffer enable?]
  (reify java.awt.event.KeyListener
    (keyReleased [this e] nil)
    (keyTyped [this e]
      (when (and @enable?
                 (get #{"(" ")" "[" "]" "{" "}" "\""}
                      (str (.getKeyChar e))))
        (.consume e)))
    (keyPressed [this e]
      (when-not (.isConsumed e)
        (let [k (convert-key-event e)
              p (exec-paredit k w buffer enable?)]
          (if p (.consume e) (format/exec-format k w)))))))

(defn input-method-event-handler [w buffer enable?]
  (reify java.awt.event.InputMethodListener
    (inputMethodTextChanged [this e]
      (let [k (convert-input-method-event e)
            p (exec-paredit k w buffer enable?)]
        (when p (.consume e))))))

(defn get-toggle-fn [w]
  (let [buffer (atom (paredit.parser/edit-buffer nil 0 -1 (s/value w)))
        enable? (atom true)]
    (doto w
      (.addKeyListener (key-event-handler w buffer enable?))
      (.addInputMethodListener (input-method-event-handler w buffer enable?)))
    (fn [enable-paredit?]
      (reset! enable? enable-paredit?))))

(defn paredit-widget [x]
  (doto (if (string? x)
          (javax.swing.JTextArea. x)
          x)
    get-toggle-fn))

(defn test-paredit-widget []
  (s/native!)
  (-> (s/frame :title "Paredit Test"
               :content (s/config! (paredit-widget "(foo (bar 1))")
                                   :size [300 :by 300]))
      s/pack!
      s/show!))
