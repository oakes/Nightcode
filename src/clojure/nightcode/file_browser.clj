(ns nightcode.file-browser
  (:require [clojure.java.io :as io]
            [nightcode.dialogs :as dialogs]
            [nightcode.lein :as lein]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [seesaw.core :as s]
            [seesaw.icon :as icon])
  (:import [javax.swing SwingConstants]))

(defn enter-file-path!
  [default-file-name]
  (let [selected-path @ui/tree-selection
        project-path (ui/get-project-root-path)
        default-path (str (utils/get-relative-dir project-path selected-path)
                          (or default-file-name
                              (.getName (io/file selected-path))))]
    (dialogs/show-file-path-dialog! default-path)))

(defn new-file!
  [e]
  (let [default-file-name (if (-> @ui/tree-selection
                                  ui/get-project-path
                                  lein/java-project?)
                            "Example.java" "example.clj")]
    (when-let [leaf-path (enter-file-path! default-file-name)]
      (let [new-file (io/file (ui/get-project-root-path) leaf-path)]
        (if (.exists new-file)
          (s/alert (utils/get-string :file_exists))
          (do
            (io!
              (.mkdirs (.getParentFile new-file))
              (.createNewFile new-file))
            (ui/update-project-tree! (.getCanonicalPath new-file))))))))

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
                    :focusable? false)
    (.setVerticalTextPosition SwingConstants/BOTTOM)
    (.setHorizontalTextPosition SwingConstants/CENTER))))

(defn create-card
  []
  (s/border-panel :north (ui/wrap-panel :items (create-widgets))
                  :center (s/scrollable (ui/wrap-panel :id :files))))

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
