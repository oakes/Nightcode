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
               (run-repl! process (ui/get-io! console)))]
    ; start the repl
    (run!)
    ; create a shortcut to restart the repl
    (doto (s/config! console :id :repl-console)
      shortcuts/create-hints!
      (shortcuts/create-mappings! {:repl-console run!}))))
