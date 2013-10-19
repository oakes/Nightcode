(ns nightcode.dialogs
  (:require [clojure.java.io :as io]
            [nightcode.utils :as utils]
            [seesaw.core :as s]
            [seesaw.icon :as icon])
  (:import [javax.swing JRadioButton]))

(defn show-remove-dialog
  [is-project?]
  (-> (s/dialog :content (utils/get-string (if is-project?
                                             :remove_project_warning
                                             :remove_file_warning))
                :options
                [(s/button :text (utils/get-string (if is-project?
                                                     :remove_project
                                                     :remove_file))
                           :listen [:action #(s/return-from-dialog % true)])
                 (s/button :text (utils/get-string :cancel)
                           :listen [:action #(s/return-from-dialog % false)])])
      s/pack!
      s/show!))

(defn show-file-path-dialog
  [default-path]
  (let [text-field (s/text :id :new-file-path :text default-path)]
    (-> (s/dialog :content (s/vertical-panel
                             :items [(utils/get-string :enter_path) text-field])
                  :options
                  [(s/button :text (utils/get-string :ok)
                             :listen [:action #(s/return-from-dialog
                                                 % (s/text text-field))])
                   (s/button :text (utils/get-string :cancel)
                             :listen [:action #(s/return-from-dialog % nil)])])
        s/pack!
        s/show!)))

(defn show-project-clj-dialog
  []
  (-> (s/dialog :content (utils/get-string :project_clj_required)
                :options [(s/button :text (utils/get-string :create_project_clj)
                                    :listen [:action
                                             #(s/return-from-dialog % true)])
                          (s/button :text (utils/get-string :continue)
                                    :listen [:action
                                             #(s/return-from-dialog % false)])])
      s/pack!
      s/show!))

(defn show-project-type-dialog
  [dir]
  (let [raw-project-name (.getName dir)
        parent-dir (.getParent dir)
        group (s/button-group)
        package-name-text (s/text :columns 20)
        types [[:console-clojure :console "Clojure"]
               [:game-clojure :game "Clojure"]
               [:android-clojure :android "Clojure"]
               [:ios-clojure :ios "Clojure"]
               [:desktop-clojure :desktop "Clojure"]
               [:console-java :console "Java"]
               [:game-java :game "Java"]
               [:android-java :android "Java"]
               [:ios-java :ios "Java"]
               [:web-clojure :web "ClojureScript"]]
        toggle (fn [_]
                 (s/text! package-name-text
                          (-> (str raw-project-name ".core")
                              utils/format-project-name)))
        _ (toggle nil) ; initialize the package name text
        finish (fn []
                 (let [project-type (s/id-of (s/selection group))
                       project-name (-> raw-project-name
                                        utils/format-project-name)
                       package-name (-> (s/text package-name-text)
                                        utils/format-package-name)
                       project-dir (-> (io/file parent-dir project-name)
                                       .getCanonicalPath)]
                   [project-type project-name package-name project-dir]))
        buttons (for [[id name-key lang-str] types]
                  (doto (s/radio :id id
                                 :text (str "<html>"
                                            "<center>"
                                            (utils/get-string name-key) "<br>"
                                            "<i>" lang-str "</i>"
                                            "</center>")
                                 :group group
                                 :selected? (= id :console-clojure)
                                 :valign :center
                                 :halign :center
                                 :listen [:action toggle])
                        (.setSelectedIcon (icon/icon (str (name id) "2.png")))
                        (.setIcon (icon/icon (str (name id) ".png")))
                        (.setVerticalTextPosition JRadioButton/BOTTOM)
                        (.setHorizontalTextPosition JRadioButton/CENTER)))]
    (-> (s/dialog
          :title (utils/get-string :specify_project_type)
          :content (s/vertical-panel
                     :items [(s/grid-panel :columns 4
                                           :rows 2
                                           :items buttons)
                             (s/flow-panel :items [package-name-text])])
          :options [(s/button :text (utils/get-string :create_project)
                              :listen [:action #(s/return-from-dialog
                                                  % (finish))])])
        s/pack!
        s/show!)))

(defn show-shut-down-dialog
  []
  (-> (s/dialog :content (utils/get-string :quit_confirm)
                :options [(s/button :text (utils/get-string :quit)
                                    :listen [:action
                                             #(s/return-from-dialog % true)])
                          (s/button :text (utils/get-string :cancel)
                                    :listen [:action
                                             #(s/return-from-dialog % false)])])
      s/pack!
      s/show!))
