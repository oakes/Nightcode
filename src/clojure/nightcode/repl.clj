(ns nightcode.repl
  (:require [nightcode.editors :as editors]
            [nightcode.lein :as lein]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [seesaw.core :as s]))

(defn run-repl!
  "Starts a REPL process."
  [process in-out]
  (lein/stop-process! process)
  (->> (lein/start-process-indirectly! process nil "clojure.main")
       (lein/start-thread! in-out)))

(defn create-pane
  "Returns the pane with the REPL."
  [console]
  (let [process (atom nil)
        run! (fn [& _]
               (s/request-focus! (-> console .getViewport .getView))
               (run-repl! process (ui/get-io! console)))
        console-map {:view console
                     :toggle-paredit-fn! (editors/init-paredit!
                                           (.getTextArea console) false true)}]
    ; set the font size and paredit
    (add-watch editors/font-size
               :set-repl-font-size
               (fn [_ _ _ x]
                 (editors/set-font-sizes! x console-map)))
    (add-watch editors/paredit-enabled?
               :set-repl-paredit
               (fn [_ _ _ enable?]
                 (editors/set-paredit! enable? console-map)))
    ; start the repl
    (run!)
    ; create a shortcut to restart the repl
    (doto (s/config! console :id :repl-console)
      shortcuts/create-hints!
      (shortcuts/create-mappings! {:repl-console run!}))))
