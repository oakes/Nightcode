(ns nightcode.file-browser
  (:require [clojure.java.io :as io]
            [nightcode.dialogs :as dialogs]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [seesaw.core :as s]
            [seesaw.icon :as icon])
  (:import [javax.swing JLabel SwingConstants]))

(declare update-card!)

(def ^:const tile-size 150)
(def edit-mode? (atom false))

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
  [& _]
  (when-let [new-file (enter-filename! "example.clj")]
    (if (.exists new-file)
      (s/alert (utils/get-string :file-exists))
      (do
        (io!
          (.mkdirs (.getParentFile new-file))
          (.createNewFile new-file))
        (ui/update-project-tree! (.getCanonicalPath new-file))))))

(defn edit-files!
  [& _]
  (reset! edit-mode? true)
  (update-card!))

(defn finish-edits!
  [& _]
  (reset! edit-mode? false)
  (update-card!))

(defn save-edits!
  [& _]
  (doseq [tile (s/select @ui/root [:#file-grid :.edit])]
    (let [path (.getName tile)
          f (io/file path)
          fname (some-> (s/select tile [:.name]) first s/text)]
      (cond
        ; delete
        (some-> (s/select tile [:.delete]) first (s/config :selected?))
        (utils/delete-file-recursively! @ui/tree-projects path)
        ; rename
        (not= (.getName f) fname)
        (io! (.renameTo f (io/file (.getParentFile f) fname))))))
  (ui/update-project-tree!)
  (finish-edits!))

(defn create-actions
  []
  {:up go-up!
   :new-file new-file!
   :edit edit-files!
   :save save-edits!
   :cancel finish-edits!})

(defn create-widgets
  []
  [(create-up-button)
   (ui/button :id :new-file
              :text (utils/get-string :new-file)
              :listen [:action new-file!]
              :focusable? false)
   (ui/button :id :edit
              :text (utils/get-string :edit)
              :listen [:action edit-files!]
              :focusable? false)
   (ui/button :id :save
              :text (utils/get-string :save)
              :listen [:action save-edits!]
              :focusable? false)
   (ui/button :id :cancel
              :text (utils/get-string :cancel)
              :listen [:action finish-edits!]
              :focusable? false)])

(defn toggle-visible!
  [view path]
  (let [edit? @edit-mode?
        buttons {:#up (and (not edit?)
                           (not (contains? @ui/tree-projects path)))
                 :#new-file (not edit?)
                 :#edit (and (not edit?)
                             (->> (io/file path)
                               .listFiles
                               (filter #(.isFile %))
                               seq))
                 :#save edit?
                 :#cancel edit?}]
    (doseq [[id should-show?] buttons]
      (ui/config! view id :visible? should-show?))))

(defn get-icon-path
  [f]
  (when-not (.isDirectory f)
    (case (utils/get-extension (.getName f))
      "clj" "file-clojure.png"
      "cljs" "file-clojure.png"
      "java" "file-java.png"
      "file.png")))

(defn protect-file?
  [path]
  false)

(defn create-tile
  [f]
  (when-not (.isHidden f)
    (if (and @edit-mode?
             (.isFile f)
             (not (protect-file? (.getCanonicalPath f))))
      (doto (s/border-panel :class :edit
                            :north (s/checkbox :class :delete
                                               :text (utils/get-string :delete)
                                               :halign :center
                                               :focusable? false)
                            :center (some-> (get-icon-path f) icon/icon JLabel.)
                            :south (s/text :class :name
                                           :text (.getName f)
                                           :editable? true)
                            :size [tile-size :by tile-size])
        (.setName (.getCanonicalPath f)))
      (doto (s/button :icon (some-> (get-icon-path f) icon/icon)
                      :text (.getName f)
                      :size [tile-size :by tile-size]
                      :listen [:action (->> (.getCanonicalPath f)
                                            ui/update-project-tree!
                                            (fn [_]))]
                      :focusable? false
                      :enabled? (and (or (.isDirectory f)
                                         (utils/valid-file? f))
                                     (not @edit-mode?)))
        (.setVerticalTextPosition SwingConstants/BOTTOM)
        (.setHorizontalTextPosition SwingConstants/CENTER)))))

(defn create-card
  []
  (doto (s/border-panel :id :file-browser
                        :north (ui/wrap-panel :items (create-widgets))
                        :center (s/scrollable (ui/wrap-panel :id :file-grid)))
    shortcuts/create-hints!
    (shortcuts/create-mappings! (create-actions))))

(defn update-card!
  ([path]
    (when-let [file-browser (s/select @ui/root [:#file-browser])]
      (toggle-visible! file-browser path)
      (s/config! (s/select file-browser [:#file-grid])
                 :items (->> (io/file path)
                             .listFiles
                             sort
                             (map create-tile)
                             (remove nil?)))))
  ([]
    (some-> @ui/tree-selection update-card!)))

(add-watch ui/tree-selection
           :show-file-browser
           (fn [_ _ _ path]
             (reset! edit-mode? false)
             (when (and path (.isDirectory (io/file path)))
               (update-card! path))))
