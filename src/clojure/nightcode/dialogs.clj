(ns nightcode.dialogs
  (:require [clojure.java.io :as io]
            [clojure.string :as string]
            [nightcode.sandbox :as sandbox]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [seesaw.chooser :as chooser]
            [seesaw.core :as s]
            [seesaw.icon :as icon])
  (:import [java.awt FileDialog]
           [javax.swing JRadioButton]))

(defn center!
  [dialog]
  (.setLocationRelativeTo dialog nil)
  dialog)

(defn show-simple-dialog!
  [text]
  (-> (s/dialog :content text)
      s/pack!
      center!
      s/show!))

(defn show-native-dialog!
  [dir mode]
  (do (System/setProperty "apple.awt.fileDialogForDirectories" "true")
    (let [dlg (doto (FileDialog. @ui/root "" mode)
                (.setDirectory dir)
                (.setVisible true))
          d (.getDirectory dlg)
          f (.getFile dlg)]
      (when (and d f)
        (io/file d f)))))

(defn show-save-dialog!
  []
  (if (sandbox/get-dir)
    (show-native-dialog! nil FileDialog/SAVE)
    (chooser/choose-file :type :save)))

(defn show-open-dialog!
  ([]
    (show-open-dialog! nil))
  ([dir]
    (if (sandbox/get-dir)
      (show-native-dialog! dir FileDialog/LOAD)
      (chooser/choose-file :type :open
                           :dir dir
                           :selection-mode :dirs-only
                           :remember-directory? (nil? dir)))))

(defn show-remove-dialog!
  [project?]
  (-> (s/dialog :content (utils/get-string (if project?
                                             :remove-project-warning
                                             :remove-file-warning))
                :options
                [(s/button :text (utils/get-string (if project?
                                                     :remove-project
                                                     :remove-file))
                           :listen [:action #(s/return-from-dialog % true)])
                 (s/button :text (utils/get-string :cancel)
                           :listen [:action #(s/return-from-dialog % false)])])
      s/pack!
      center!
      s/show!))

(defn show-file-path-dialog!
  [default-path]
  (let [text-field (s/text :id :new-file-path :text default-path)]
    (-> (s/dialog :content text-field
                  :options
                  [(s/button :text (utils/get-string :ok)
                             :listen [:action #(s/return-from-dialog
                                                 % (s/text text-field))])
                   (s/button :text (utils/get-string :cancel)
                             :listen [:action #(s/return-from-dialog % nil)])])
        s/pack!
        center!
        s/show!)))

(defn show-project-clj-dialog!
  []
  (-> (s/dialog :content (utils/get-string :project-clj-required)
                :options [(s/button :text (utils/get-string :create-project-clj)
                                    :listen [:action
                                             #(s/return-from-dialog % true)])
                          (s/button :text (utils/get-string :continue)
                                    :listen [:action
                                             #(s/return-from-dialog % false)])])
      s/pack!
      center!
      s/show!))

(defn show-project-type-dialog!
  [dir]
  (let [raw-project-name (.getName dir)
        parent-dir (.getParent dir)
        group (s/button-group)
        lang-group (s/button-group)
        package-name-text (->> (str raw-project-name ".core")
                               utils/format-project-name
                               (s/text :columns 20 :text))
        types [[:console [:clojure :java]]
               [:game [:clojure :java]]
               [:android [:clojure :java]]
               [:ios [:clojure :java]]
               [:desktop [:clojure]]
               [:web [:clojure]]
               [:graphics [:clojure]]
               [:sounds [:clojure]]
               [:dotnet [:clojure]]]
        types (if (sandbox/get-dir)
                (remove #(contains? #{:ios :android} (first %)) types)
                types)
        update-lang! (fn [e]
                       ; select the clojure option
                       (-> (s/select (s/to-root e) [:#clojure])
                           (s/config! :selected? true))
                       ; hide the language choices if there is only one
                       (let [type (some #(if (= (first %) (s/id-of e)) %) types)
                             lang (s/select (s/to-root e) [:#lang])]
                         (if (= 1 (count (second type)))
                           (s/hide! lang)
                           (s/show! lang))))
        finish (fn []
                 (let [project-type (->> [(s/selection group)
                                          (s/selection lang-group)]
                                         (map #(name (s/id-of %)))
                                         (string/join "-")
                                         keyword)
                       project-name (-> raw-project-name
                                        utils/format-project-name)
                       package-name (-> (s/text package-name-text)
                                        utils/format-package-name)
                       project-dir (-> (io/file parent-dir project-name)
                                       .getCanonicalPath)]
                   [project-type project-name package-name project-dir]))
        buttons (for [[id template-ids] types]
                  (doto (s/radio :id id
                                 :text (str "<html>"
                                            "<center>"
                                            (utils/get-string id) "<br>"
                                            "</center>")
                                 :group group
                                 :selected? (= id :console)
                                 :listen [:action update-lang!]
                                 :valign :center
                                 :halign :center)
                        (.setSelectedIcon (icon/icon (str (name id) "2.png")))
                        (.setIcon (icon/icon (str (name id) ".png")))
                        (.setVerticalTextPosition JRadioButton/BOTTOM)
                        (.setHorizontalTextPosition JRadioButton/CENTER)))
        lang-buttons (for [k [:clojure :java]]
                       (s/radio :id k
                                :text (utils/get-string k)
                                :group lang-group
                                :selected? (= k :clojure)
                                :valign :center
                                :halign :center))]
    (-> (s/dialog
          :title (utils/get-string :specify-project-type)
          :content (s/vertical-panel
                     :items [(s/grid-panel :columns (/ (count types) 2)
                                           :items buttons)
                             (s/flow-panel :items [package-name-text])
                             (s/horizontal-panel :id :lang
                                                 :items lang-buttons)])
          :options [(s/button :text (utils/get-string :create-project)
                              :listen [:action #(s/return-from-dialog
                                                  % (finish))])])
        s/pack!
        center!
        s/show!)))

(defn show-shut-down-dialog!
  [unsaved-paths]
  (-> (s/dialog :content (str (utils/get-unsaved-paths-message unsaved-paths)
                              (utils/get-string :quit-confirm))
                :options [(s/button :text (utils/get-string :quit)
                                    :listen [:action
                                             #(s/return-from-dialog % true)])
                          (s/button :text (utils/get-string :cancel)
                                    :listen [:action
                                             #(s/return-from-dialog % false)])])
      s/pack!
      center!
      s/show!))
