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

(def ^:dynamic *logcat-widgets* [:toggle-logcat :close])

(defn create-action
  [k path [console panel] [process is-running?]]
  (case k
    :toggle-logcat (let [start! (fn []
                                  (run! process (ui/get-io! console) path)
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
                     (fn [& _]
                       (reset! is-running? (if @is-running? (stop!) (start!)))
                       (editors/update-tabs! path)))
    :close editors/close-selected-editor!
    nil))

(defn create-widget
  [k action-fn!]
  (case k
    :toggle-logcat (s/button :id k
                             :text (utils/get-string :start)
                             :listen [:action action-fn!])
    :close (ui/button :id k
                      :text "X"
                      :focusable? false
                      :listen [:action action-fn!])
    (s/make-widget k)))

(defmethod editors/create-editor :logcat [_ path]
  (when (= (.getName (io/file path)) logcat-name)
    (let [; create the console and the panel that holds it
          console (editors/create-console nil)
          panel (ui/wrap-panel)
          ; create the atoms that keep track of important values
          process (atom nil)
          is-running? (atom false)
          ; put the views and atoms in vectors to make it easier to pass them
          views [console panel]
          atoms [process is-running?]
          ; get the path of the parent directory
          path (-> path io/file .getParentFile .getCanonicalPath)]
      ; add widgets and create hints
      (doto panel
        (s/config! :items (map (fn [k]
                                 (let [a (create-action k path views atoms)]
                                   (doto (create-widget k a)
                                     (shortcuts/create-mapping! a))))
                               *logcat-widgets*))
        shortcuts/create-hints!)
      ; return a map describing the logcat view
      {:view (s/border-panel :north panel :center console)
       :close-fn! #(lein/stop-process! process)
       :should-remove-fn #(not (lein/is-android-project? path))
       :italicize-fn (fn [] @is-running?)})))

(defmethod ui/adjust-nodes :logcat [_ parent children]
  (if (some-> (:file parent) .getCanonicalPath lein/is-android-project?)
    (cons {:html "<html><b><font color='green'>LogCat</font></b></html>"
           :name "LogCat"
           :file (io/file (:file parent) logcat-name)}
          children)
    children))
