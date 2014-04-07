(ns nightcode.logcat
  (:require [clojure.java.io :as io]
            [leiningen.core.main]
            [leiningen.droid.utils]
            [nightcode.editors :as editors]
            [nightcode.lein :as lein]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [seesaw.core :as s]))

(def ^:const logcat-name "*LogCat*")

(defn run-logcat!
  "Starts a LogCat process."
  [process in-out path]
  (lein/stop-process! process)
  (->> (lein/start-process! process
                            nil
                            (-> (lein/read-project-clj path)
                                :android
                                :sdk-path
                                (leiningen.droid.utils/sdk-binary :adb))
                            "logcat"
                            "*:I")
       (binding [leiningen.core.main/*exit-process?* false])
       (lein/start-thread! in-out)))

(def ^:dynamic *widgets* [:toggle-logcat :close])

(defn create-actions
  [path console panel process running?]
  (let [start! (fn []
                 (run-logcat! process (ui/get-io! console) path)
                 (ui/config! panel
                             :#toggle-logcat
                             :text (utils/get-string :stop))
                 true)
        stop! (fn []
                (lein/stop-process! process)
                (ui/config! panel
                            :#toggle-logcat
                            :text (utils/get-string :start))
                false)]
    {:stop-logcat stop!
     :start-logcat start!
     :toggle-logcat (fn [& _]
                      (reset! running? (if @running? (stop!) (start!)))
                      (editors/update-tabs! path))
     :close editors/close-selected-editor!}))

(defn create-widgets
  [actions]
  {:toggle-logcat (s/button :id :toggle-logcat
                            :text (utils/get-string :start)
                            :listen [:action (:toggle-logcat actions)])
   :close (ui/button :id :close
                     :text "X"
                     :focusable? false
                     :listen [:action (:close actions)])})

(defmethod editors/create-editor :logcat [_ path]
  (when (= (.getName (io/file path)) logcat-name)
    (let [; create the console and the pane that holds it
          console (editors/create-console nil)
          logcat-pane (s/border-panel :center console)
          ; create atoms to hold important values
          process (atom nil)
          running? (atom false)
          ; get the path of the parent directory
          path (-> path io/file .getParentFile .getCanonicalPath)
          ; create the actions and widgets
          actions (create-actions path console logcat-pane process running?)
          widgets (create-widgets actions)
          ; create the bar that holds the widgets
          widget-bar (ui/wrap-panel :items (map #(get widgets % %) *widgets*))]
      ; add the widget bar if necessary
      (when (> (count *widgets*) 0)
        (doto logcat-pane
          (s/config! :north widget-bar)
          shortcuts/create-hints!
          (shortcuts/create-mappings! actions)))
      ; return a map describing the logcat view
      {:view logcat-pane
       :close-fn! (:stop-logcat actions)
       :should-remove-fn #(not (lein/android-project? path))
       :italicize-fn (fn [] @running?)})))

(defmethod ui/adjust-nodes :logcat [_ parent children]
  (if (some-> (:file parent) .getCanonicalPath lein/android-project?)
    (cons {:html "<html><b><font color='green'>LogCat</font></b></html>"
           :name "LogCat"
           :file (io/file (:file parent) logcat-name)}
          children)
    children))
