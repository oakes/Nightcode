(ns nightcode.completions
  (:require [clojure.edn :as edn]
            [clojure.java.io :as io]
            [compliment.core :as compliment]
            [nightcode.utils :as utils]
            [paredit.loc-utils :as loc-utils]
            [paredit.static-analysis :as static-analysis]
            [paredit.parser :as parser])
  (:import [java.awt.event KeyEvent KeyListener]
           [javax.swing JComponent KeyStroke]
           [org.fife.ui.autocomplete
            AutoCompletion BasicCompletion DefaultCompletionProvider]))

(def doc-enabled? (atom (or (utils/read-pref :enable-doc) false)))
(def ^:dynamic *namespaces* ['clojure.core])
(def ^:const completer-keys #{KeyEvent/VK_ENTER
                              KeyEvent/VK_UP
                              KeyEvent/VK_DOWN
                              KeyEvent/VK_ESCAPE})

(defn allow-symbol?
  [symbol-str ns]
  true)

(defn get-completion-context
  [text-area prefix]
  (let [caretpos (.getCaretPosition text-area)
        all-text (.getText text-area)
        first-str (subs all-text 0 (- caretpos (count prefix)))
        second-str (subs all-text caretpos)]
    (-> (str first-str "__prefix__" second-str)
        parser/parse
        loc-utils/parsed-root-loc
        (static-analysis/top-level-code-form caretpos)
        first
        loc-utils/node-text
        read-string
        (try (catch Exception _)))))

(defn get-clojure-completions
  [prefix ns context]
  (for [symbol-str (try
                     (compliment/completions prefix ns context)
                     (catch Exception _))
        :when (and (some? symbol-str) (allow-symbol? symbol-str ns))]
    {:symbol-str symbol-str
     :doc-str (compliment/documentation symbol-str ns)}))

(defn create-completion
  [provider symbol-str doc-str]
  (->> (str "<html><body><pre><span style='font-size: 11px;'>"
            doc-str
            "</span></pre></body></html>")
       (BasicCompletion. provider symbol-str nil)))

(defn create-completion-provider
  [text-area extension]
  (cond
    ; clojure
    (contains? utils/clojure-exts extension)
    (proxy [DefaultCompletionProvider] []
      (getCompletions [comp]
        (try
          (let [prefix (.getAlreadyEnteredText this comp)
                context (get-completion-context text-area prefix)]
            (->> *namespaces*
                 (map #(get-clojure-completions prefix % context))
                 flatten
                 set
                 (map #(create-completion this (:symbol-str %) (:doc-str %)))
                 doall))
          (catch Exception _ '())))
      (isValidChar [ch]
        (or (Character/isLetterOrDigit ch)
            (contains? #{\* \+ \! \- \_ \? \/ \. \: \< \>} ch)))
      (isAutoActivateOkay [comp]
        true))
    ; anything else
    :else nil))

(defn create-completer
  [text-area extension]
  (when-let [provider (create-completion-provider text-area extension)]
    (doto (AutoCompletion. provider)
      (.setShowDescWindow true)
      (.setAutoCompleteSingleChoices false)
      (.setAutoCompleteEnabled true)
      (.setAutoActivationEnabled @doc-enabled?)
      (.setAutoActivationDelay 200)
      (.setChoicesWindowSize 150 300)
      (.setDescriptionWindowSize 600 300))))

(defn install-completer!
  [text-area completer]
  (.install completer text-area)
  ; this is an ugly way of making sure paredit-widget doesn't
  ; receive the KeyEvent if the AutoComplete window is visible
  (.addKeyListener text-area
    (reify KeyListener
      (keyReleased [this e] nil)
      (keyTyped [this e] nil)
      (keyPressed [this e]
        (when (and (contains? completer-keys (.getKeyCode e))
                   (.isPopupVisible completer))
          (let [ks (KeyStroke/getKeyStroke (.getKeyCode e) 0)
                condition JComponent/WHEN_FOCUSED]
            (.processKeyBinding text-area ks e condition true))
          (.consume e))))))
