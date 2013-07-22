(ns nightcode.dialogs
  (:require [clojure.java.io :as java.io]
            [nightcode.utils :as utils]
            [seesaw.core :as s]
            [seesaw.icon :as icon])
  (:import [javax.swing JRadioButton]))

(defn show-remove-dialog
  [is-project?]
  (-> (s/dialog :content
                (if is-project?
                  "Remove this project? It WILL NOT be deleted from the disk."
                  "Remove this file? It WILL be deleted from the disk.")
                :options
                [(s/button :text (if is-project?
                                   "Remove Project"
                                   "Remove File")
                           :listen [:action #(s/return-from-dialog % true)])
                 (s/button :text "Cancel"
                           :listen [:action #(s/return-from-dialog % false)])])
      s/pack!
      s/show!))

(defn show-file-path-dialog
  [default-path]
  (let [text-field (s/text :id :new-file-path :text default-path)]
    (-> (s/dialog :content (s/vertical-panel
                             :items ["Enter a path relative to the project."
                                     text-field])
                  :options
                  [(s/button :text "OK"
                             :listen [:action #(s/return-from-dialog
                                                 % (s/text text-field))])
                   (s/button :text "Cancel"
                             :listen [:action #(s/return-from-dialog % nil)])])
        s/pack!
        s/show!)))

(defn show-project-clj-dialog
  []
  (-> (s/dialog :content "You need a project.clj file to build this project."
                :options [(s/button :text "Create project.clj"
                                    :listen [:action
                                             #(s/return-from-dialog % true)])
                          (s/button :text "Continue"
                                    :listen [:action
                                             #(s/return-from-dialog % false)])])
      s/pack!
      s/show!))

(defn show-project-type-dialog
  [dir]
  (let [raw-project-name (.getName dir)
        parent-dir (.getParent dir)
        group (s/button-group)
        package-name-text (s/text :visible? false :columns 20)
        types [[:console "Console" "Clojure"]
               [:seesaw "Desktop" "Clojure"]
               [:cljs-kickoff "Web" "ClojureScript"]
               [:android "Android" "Clojure"]
               [:console-java "Console" "Java"]
               [:mini2dx-java "Simple Game" "Java"]
               [:libgdx-java "Advanced Game" "Java"]
               [:android-java "Android" "Java"]]
        toggle (fn [e]
                 (s/config! package-name-text
                            :visible?
                            (let [id (name (s/id-of e))]
                              (or (>= (.indexOf id "java") 0)
                                  (>= (.indexOf id "android") 0))))
                 (s/text! package-name-text
                          (utils/format-name (str "com." raw-project-name)
                                             (s/id-of (s/selection group))))
                 (s/pack! (s/to-root e)))
        finish (fn []
                 (let [project-type (s/id-of (s/selection group))
                       project-name (-> raw-project-name
                                        (utils/format-name nil))
                       package-name (-> (s/text package-name-text)
                                        (utils/format-name project-type))
                       project-dir (-> (java.io/file parent-dir project-name)
                                       .getCanonicalPath)]
                   [project-type project-name package-name project-dir]))
        buttons (for [[id name-str lang-str] types]
                  (doto (s/radio :id id
                                 :text (str "<html>"
                                            "<center>"
                                            name-str "<br>"
                                            "<i>" lang-str "</i>"
                                            "</center>")
                                 :group group
                                 :selected? (= id :console)
                                 :valign :center
                                 :halign :center
                                 :listen [:action toggle])
                        (.setSelectedIcon (icon/icon (str (name id) "2.png")))
                        (.setIcon (icon/icon (str (name id) ".png")))
                        (.setVerticalTextPosition JRadioButton/BOTTOM)
                        (.setHorizontalTextPosition JRadioButton/CENTER)))]
    (-> (s/dialog
          :title "Specify Project Type"
          :content (s/vertical-panel
                     :items [(s/grid-panel :columns 4
                                           :rows 2
                                           :items buttons)
                             (s/flow-panel :items [package-name-text])])
          :options [(s/button :text "Create Project"
                              :listen [:action #(s/return-from-dialog
                                                  % (finish))])])
        s/pack!
        s/show!)))
