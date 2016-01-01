(ns nightcode.file-browser
  (:require [clojure.java.io :as io]
            [nightcode.dialogs :as dialogs]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [seesaw.core :as s]
            [seesaw.icon :as icon])
  (:import [java.awt Desktop]
           [javax.swing JLabel SwingConstants]))

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
                   :listen [:action go-up!])
    (s/text! (shortcuts/wrap-hint-text "&uarr;"))
    (utils/set-accessible-name! :parent-directory)))

(defn enter-filename!
  [default-filename]
  (some->> (dialogs/show-text-field-dialog! (utils/get-string :enter-file-name)
                                            default-filename)
           (io/file @ui/tree-selection)))

(defn new-file!
  [& _]
  (when-let [new-file (enter-filename! "example.clj")]
    (if (.exists new-file)
      (dialogs/show-simple-dialog! (utils/get-string :file-exists))
      (do
        (io!
          (.mkdirs (.getParentFile new-file))
          (.createNewFile new-file))
        (ui/update-project-tree! (.getCanonicalPath new-file))))))

(defn edit-files!
  [& _]
  (reset! edit-mode? true)
  (update-card!))

(defn open-in-file-browser!
  [& _]
  (.open (Desktop/getDesktop) (io/file @ui/tree-selection)))

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
        (utils/delete-parents-recursively! @ui/tree-projects path)
        ; rename
        (not= (.getName f) fname)
        (io! (.renameTo f (io/file (.getParentFile f) fname))))))
  (ui/update-project-tree!)
  (finish-edits!))

(def ^:dynamic *widgets* [:up :new-file :edit :open-in-browser :save :cancel])

(defn create-actions
  []
  {:up go-up!
   :new-file new-file!
   :edit edit-files!
   :open-in-browser open-in-file-browser!
   :save save-edits!
   :cancel finish-edits!})

(defn create-widgets
  [actions]
  {:up (create-up-button)
   :new-file (ui/button :id :new-file
                        :text (utils/get-string :new-file)
                        :listen [:action (:new-file actions)])
   :edit (ui/button :id :edit
                    :text (utils/get-string :edit)
                    :listen [:action (:edit actions)])
   :open-in-browser (ui/button :id :open-in-browser
                               :text (utils/get-string :open-in-file-browser)
                               :listen [:action (:open-in-browser actions)])
   :save (ui/button :id :save
                    :text (utils/get-string :save)
                    :listen [:action (:save actions)])
   :cancel (ui/button :id :cancel
                      :text (utils/get-string :cancel)
                      :listen [:action (:cancel actions)])})

(defn toggle-visible!
  [view path]
  (let [edit? @edit-mode?
        buttons {:up (and (not edit?)
                          (not (contains? @ui/tree-projects path)))
                 :new-file (not edit?)
                 :edit (and (not edit?)
                            (->> (io/file path)
                                 .listFiles
                                 (filter #(.isFile %))
                                 seq))
                 :open-in-browser (and (not edit?)
                                       (Desktop/isDesktopSupported))
                 :save edit?
                 :cancel edit?}]
    (doseq [btn (s/select view [:#widgets :<javax.swing.JComponent>])]
      (s/config! btn :visible? (get buttons (s/id-of btn) (not edit?))))))

(defn get-icon-path
  [f]
  (when-not (.isDirectory f)
    (case (utils/get-extension (.getName f))
      "clj" "file-clojure.png"
      "cljs" "file-clojure.png"
      "java" "file-java.png"
      "git" "git.png"
      "logcat" nil
      "file.png")))

(defn protect-file?
  [path]
  false)

(defn create-tile
  [{:keys [html name file enabled?]}]
  (when-not (or (.isHidden file) (.startsWith name "."))
    (if (and @edit-mode?
             (.isFile file)
             (not (protect-file? (.getCanonicalPath file))))
      (doto (s/border-panel :class :edit
                            :north (some-> (get-icon-path file)
                                           icon/icon
                                           JLabel.)
                            :center (s/checkbox :class :delete
                                                :text (utils/get-string :delete)
                                                :halign :center)
                            :south (s/text :class :name
                                           :text name
                                           :editable? true)
                            :size [tile-size :by tile-size])
        (.setName (.getCanonicalPath file)))
      (doto (s/button :icon (some-> (get-icon-path file) icon/icon)
                      :text (or html name)
                      :size [tile-size :by tile-size]
                      :listen [:action (->> (.getCanonicalPath file)
                                            ui/update-project-tree!
                                            (fn [_]))]
                      :enabled? (and (or enabled?
                                         (.isDirectory file)
                                         (utils/valid-file? file))
                                     (not @edit-mode?)))
        (.setVerticalTextPosition SwingConstants/BOTTOM)
        (.setHorizontalTextPosition SwingConstants/CENTER)))))

(defn create-tiles
  [f]
  (->> (.listFiles f)
       (ui/get-nodes (ui/get-node f))
       (map create-tile)
       (remove nil?)))

(defn create-card
  []
  (let [actions (create-actions)
        widgets (create-widgets actions)
        widget-bar (ui/wrap-panel :items (map #(get widgets % %) *widgets*)
                                  :id :widgets)]
    (doto (s/border-panel :id :file-browser
                          :north widget-bar
                          :center (s/scrollable (ui/wrap-panel :id :file-grid)))
      shortcuts/create-hints!
      (shortcuts/create-mappings! actions))))

(defn update-card!
  ([path]
    (when-let [file-browser (s/select @ui/root [:#file-browser])]
      (toggle-visible! file-browser path)
      (s/config! (s/select file-browser [:#file-grid])
                 :items (create-tiles (io/file path)))))
  ([]
    (some-> @ui/tree-selection update-card!)))

(add-watch ui/tree-selection
           :show-file-browser
           (fn [_ _ _ path]
             (reset! edit-mode? false)
             (when (and path (.isDirectory (io/file path)))
               (update-card! path))))
