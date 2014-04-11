(ns nightcode.file-browser
  (:require [clojure.java.io :as io]
            [nightcode.dialogs :as dialogs]
            [nightcode.lein :as lein]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [seesaw.core :as s]
            [seesaw.icon :as icon])
  (:import [javax.swing SwingConstants]))

(defn enter-filename!
  [default-filename]
  (some->> (dialogs/show-file-path-dialog! default-filename)
           (io/file @ui/tree-selection)))

(defn new-file!
  [e]
  (let [default-filename (if (-> @ui/tree-selection
                               ui/get-project-path
                               lein/java-project?)
                           "Example.java" "example.clj")]
    (when-let [new-file (enter-filename! default-filename)]
      (if (.exists new-file)
        (s/alert (utils/get-string :file_exists))
        (do
          (io!
            (.mkdirs (.getParentFile new-file))
            (.createNewFile new-file))
          (ui/update-project-tree! (.getCanonicalPath new-file)))))))

(defn create-widgets
  []
  [(ui/button :id :new-file
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
  (doto (s/border-panel :north (ui/wrap-panel :items (create-widgets))
                        :center (s/scrollable (ui/wrap-panel :id :files)))
    shortcuts/create-hints!
    (shortcuts/create-mappings! {:new-file new-file!})))

(defn update-card!
  []
  (when-let [file-grid (s/select @ui/root [:#files])]
    (s/config! file-grid :items (->> (io/file @ui/tree-selection)
                                     .listFiles
                                     sort
                                     (map create-tile)
                                     (remove nil?)))))

(add-watch ui/tree-selection
           :show-file-browser
           (fn [_ _ _ path]
             (when (and path (.isDirectory (io/file path)))
               (update-card!))))
