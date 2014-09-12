(ns nightcode.git
  (:require [clojure.java.io :as io]
            [nightcode.editors :as editors]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [seesaw.core :as s]))

(def ^:const git-name "*Git*")

(defn git-project?
  [path]
  (.exists (io/file path ".git")))

(def ^:dynamic *widgets* [:pull :push :configure])

(defn create-actions
  []
  {:pull (fn [& _])
   :push (fn [& _])
   :configure (fn [& _])})

(defn create-widgets
  [actions]
  {:pull (ui/button :id :pull
                    :text (utils/get-string :pull)
                    :listen [:action (:pull actions)])
   :push (ui/button :id :push
                    :text (utils/get-string :push)
                    :listen [:action (:push actions)])
   :configure (ui/button :id :configure
                         :text (utils/get-string :configure)
                         :listen [:action (:configure actions)])})

(defmethod editors/create-editor :git [_ path]
  (when (= (.getName (io/file path)) git-name)
    (let [; create the pane
          git-pane (s/border-panel)
          ; get the path of the parent directory
          path (-> path io/file .getParentFile .getCanonicalPath)
          ; create the actions and widgets
          actions (create-actions)
          widgets (create-widgets actions)
          ; create the bar that holds the widgets
          widget-bar (ui/wrap-panel :items (map #(get widgets % %) *widgets*))]
      ; add the widget bar if necessary
      (when (> (count *widgets*) 0)
        (doto git-pane
          (s/config! :north widget-bar)
          shortcuts/create-hints!
          (shortcuts/create-mappings! actions)))
      ; return a map describing the view
      {:view git-pane
       :close-fn! (fn [])
       :should-remove-fn #(not (git-project? path))
       :italicize-fn (fn [] false)})))

(defmethod ui/adjust-nodes :git [_ parent children]
  (if (some-> (:file parent) .getCanonicalPath git-project?)
    (cons {:html "<html><b><font color='orange'>Git</font></b></html>"
           :name "Git"
           :file (io/file (:file parent) git-name)}
          children)
    children))
