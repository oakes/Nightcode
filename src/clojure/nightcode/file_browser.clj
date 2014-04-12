(ns nightcode.file-browser
  (:require [clojure.java.io :as io]
            [nightcode.dialogs :as dialogs]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [seesaw.core :as s]
            [seesaw.icon :as icon])
  (:import [javax.swing SwingConstants]))

(defn go-up!
  [& _]
  (-> @ui/tree-selection
      io/file
      .getParentFile
      .getCanonicalPath
      ui/update-project-tree!))

(defn create-up-button
  []
  (doto (ui/button :id :up
                   :text "^^"
                   :focusable? false
                   :listen [:action go-up!])
    (s/text! (shortcuts/wrap-hint-text "&uarr;"))))

(defn enter-filename!
  [default-filename]
  (some->> (dialogs/show-file-path-dialog! default-filename)
           (io/file @ui/tree-selection)))

(defn new-file!
  [e]
  (when-let [new-file (enter-filename! "example.clj")]
    (if (.exists new-file)
      (s/alert (utils/get-string :file_exists))
      (do
        (io!
          (.mkdirs (.getParentFile new-file))
          (.createNewFile new-file))
        (ui/update-project-tree! (.getCanonicalPath new-file))))))

(defn create-actions
  []
  {:up go-up!
   :new-file new-file!})

(defn create-widgets
  []
  [(create-up-button)
   (ui/button :id :new-file
              :text (utils/get-string :new_file)
              :listen [:action new-file!]
              :focusable? false)])

(defn get-icon-path
  [f]
  (when-not (.isDirectory f)
    (case (utils/get-extension (.getName f))
      "clj" "file-clojure.png"
      "cljs" "file-clojure.png"
      "java" "file-java.png"
      "file.png")))

(defn create-tile
  [f]
  (when-not (.isHidden f)
    (doto (s/button :icon (some-> (get-icon-path f) icon/icon)
                    :text (.getName f)
                    :size [150 :by 150]
                    :listen [:action
                             (fn [_]
                               (ui/update-project-tree! (.getCanonicalPath f)))]
                    :focusable? false
                    :enabled? (or (.isDirectory f) (utils/valid-file? f)))
    (.setVerticalTextPosition SwingConstants/BOTTOM)
    (.setHorizontalTextPosition SwingConstants/CENTER))))

(defn create-card
  []
  (doto (s/border-panel :id :file-browser
                        :north (ui/wrap-panel :items (create-widgets))
                        :center (s/scrollable (ui/wrap-panel :id :file-grid)))
    shortcuts/create-hints!
    (shortcuts/create-mappings! (create-actions))))

(defn update-card!
  [path]
  (when-let [file-browser (s/select @ui/root [:#file-browser])]
    (s/config! (s/select file-browser [:#file-grid])
               :items (->> (io/file path)
                           .listFiles
                           sort
                           (map create-tile)
                           (remove nil?)))
    (s/config! (s/select file-browser [:#up])
               :visible? (not (contains? @ui/tree-projects path)))))

(add-watch ui/tree-selection
           :show-file-browser
           (fn [_ _ _ path]
             (when (and path (.isDirectory (io/file path)))
               (update-card! path))))
