(ns nightcode.completions
  (:require [clojure.edn :as edn]
            [clojure.java.io :as io]
            [compliment.core :as compliment]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils])
  (:import [java.awt.event KeyEvent KeyListener]
           [javax.swing JComponent KeyStroke]
           [org.fife.ui.autocomplete
            AutoCompletion BasicCompletion DefaultCompletionProvider]))

(def doc-enabled? (atom (utils/read-pref :enable-doc false)))
(def ^:dynamic *namespaces* ['clojure.core])
(def ^:const completer-keys #{KeyEvent/VK_ENTER
                              KeyEvent/VK_UP
                              KeyEvent/VK_DOWN
                              KeyEvent/VK_ESCAPE})

(defn allow-symbol?
  [symbol-str ns]
  true)

(defn get-clojure-completions
  [prefix ns]
  (for [symbol-str (try
                     (compliment/completions prefix {:ns ns})
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
        (or (try
              (let [prefix (.getAlreadyEnteredText this comp)]
                (when (> (count prefix) 1)
                  (->> *namespaces*
                       (map #(get-clojure-completions prefix %))
                       flatten
                       set
                       (sort-by :symbol-str)
                       (map #(create-completion this (:symbol-str %) (:doc-str %)))
                       doall)))
              (catch Exception _))
            '()))
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
                   (some #(.isVisible %) (.getOwnedWindows @ui/root)))
          (let [ks (KeyStroke/getKeyStroke (.getKeyCode e) 0)
                condition JComponent/WHEN_FOCUSED]
            (.processKeyBinding text-area ks e condition true))
          (.consume e))))))
