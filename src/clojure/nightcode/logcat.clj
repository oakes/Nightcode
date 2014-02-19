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

(defn run!
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

(defmethod editors/create-editor :logcat [_ path]
  (when (= (.getName (io/file path)) logcat-name)
    (let [; create new console object with a reader/writer
          console (editors/create-console nil)
          ; keep track of the process and whether it's running
          process (atom nil)
          is-running? (atom false)
          ; create the start/stop button
          toggle-btn (s/button :id :toggle-logcat-button
                               :text (utils/get-string :start))
          ; create the main panel
          widget-group (ui/wrap-panel :items [toggle-btn])
          ; create the toggle action
          parent-path (-> path io/file .getParentFile .getCanonicalPath)
          start! (fn []
                   (run! process (ui/get-io! console) parent-path)
                   (s/config! toggle-btn :text (utils/get-string :stop))
                   true)
          stop! (fn []
                  (lein/stop-process! process)
                  (s/config! toggle-btn :text (utils/get-string :start))
                  false)
          toggle! (fn [_]
                    (reset! is-running? (if @is-running? (stop!) (start!)))
                    (editors/update-tabs! path))]
      ; add the toggle action to the button
      (s/listen toggle-btn :action toggle!)
      ; create shortcuts
      (doto widget-group
        (shortcuts/create-mappings! {:toggle-logcat-button toggle!})
        shortcuts/create-hints!)
      ; return a map describing the logcat view
      {:view (s/border-panel :north widget-group :center console)
       :close-fn! #(stop!)
       :should-remove-fn #(not (lein/is-android-project? parent-path))
       :italicize-fn (fn [] @is-running?)})))

(defmethod ui/adjust-nodes :logcat [_ parent children]
  (if (some-> (:file parent) .getCanonicalPath lein/is-android-project?)
    (cons {:html "<html><b><font color='green'>LogCat</font></b></html>"
           :name "LogCat"
           :file (io/file (:file parent) logcat-name)}
          children)
    children))
