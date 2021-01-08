(ns nightcode.repl
  (:require [nightcode.editors :as editors]
            [nightcode.lein :as lein]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [seesaw.core :as s]))

(defn create-pane
  "Returns the pane with the REPL."
  [console]
  (let [run! (fn [& _]
               (.setText (.getTextArea console) "")
               (lein/start-thread! (ui/get-io! console) (clojure.main/repl))
               (s/request-focus! (-> console .getViewport .getView)))
        pane (s/config! console :id :repl-console)]
    (utils/set-accessible-name! (.getTextArea pane) :repl-console)
    ; start the repl
    (run!)
    ; create a shortcut to restart the repl
    (shortcuts/create-mappings! pane {:repl-console run!})
    ; return the repl pane
    pane))
