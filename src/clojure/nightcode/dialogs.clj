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

(defn stay-on-top!
  [dialog]
  (.setAlwaysOnTop dialog true)
  dialog)

(defn show-simple-dialog!
  [text]
  (-> (s/dialog :content text)
      s/pack!
      center!
      stay-on-top!
      s/show!)
  nil)


(defn show-simple-table!
  [text & {:keys [column-delimiter row-delimiter container title]
           :or   {column-delimiter \,
                  row-delimiter    \newline
                  container        (s/frame)
                  title            ""}}]
  (let [table-markup
        (str 
          "<html>"
          "<head>"
          "<style type='text/css'>"
            "tr {margin: 0px;}"
            "tr {padding: 1px;}"
            "td {padding: 0px 1px;}"
          "</style>"
          "</head>"
          "<body>"
            "<table>"
              "<tr>"
                "<td>"
                 (-> text
                   (string/replace (re-pattern (str column-delimiter)) "</td><td>")
                   (string/replace (re-pattern (str row-delimiter))    "</td></tr><tr>"))
              "</tr>"
            "</table>"
          "</body>"
          "</html>")]
    (-> container 
       (s/config! :content table-markup :title title)
        s/pack!
        center!
        stay-on-top!
        s/show!)
    nil))

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
      stay-on-top!
      s/show!))

(defn show-text-field-dialog!
  [q-text default-text]
  (let [text-field (s/text :id :new-file-path :text default-text)]
    (-> (s/dialog :content (s/vertical-panel :items [q-text text-field])
                  :options
                  [(s/button :text (utils/get-string :ok)
                             :listen [:action #(s/return-from-dialog
                                                 % (s/text text-field))])
                   (s/button :text (utils/get-string :cancel)
                             :listen [:action #(s/return-from-dialog % nil)])])
        s/pack!
        center!
        stay-on-top!
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
      stay-on-top!
      s/show!))

(defn show-project-type-dialog!
  [dir]
  (let [; paths
        raw-project-name (.getName dir)
        project-name (utils/format-project-name raw-project-name)
        parent-dir (.getParent dir)
        ; execute button
        exec-btn (s/button :text (utils/get-string :create-project))
        ; package name
        package-text (doto (s/text :columns 20
                                   :text (utils/format-project-name
                                           (str raw-project-name ".core")))
                       (ui/text-prompt! (utils/get-string :package-prompt)))
        package-panel (s/flow-panel :items [package-text])
        ; download address
        download-text (doto (s/text :columns 20)
                        (ui/text-prompt! (utils/get-string :download-prompt)))
        download-panel (s/flow-panel :items [download-text] :visible? false)
        ; project types
        types [[:console [:clojure :java]]
               [:game [:clojure :java :javascript]]
               [:android [:clojure :java]]
               [:ios [:clojure :java]]
               [:desktop [:clojure]]
               [:web [:clojurescript :javascript]]
               [:database [:clojure]]
               [:graphics [:clojure :clojurescript]]
               [:sounds [:clojure]]
               [:download []]]
        types (if (sandbox/get-dir)
                (remove #(contains? #{:ios :android} (first %)) types)
                types)
        ; language buttons
        lang-group (s/button-group)
        lang-buttons (for [k [:clojure :java :clojurescript :javascript]]
                       (s/radio :id k
                                :class :lang-button
                                :text (utils/get-string k)
                                :group lang-group
                                :selected? (-> types first second first (= k))
                                :visible? (-> types first second set
                                              (contains? k))
                                :valign :center
                                :halign :center))
        lang-panel (s/horizontal-panel :items lang-buttons)
        ; project type buttons
        group (s/button-group)
        refresh! (fn [e]
                   (let [[name langs] (some (fn [type]
                                              (if (= (first type)
                                                     (s/id-of e)) type))
                                            types)
                         lang-buttons (s/select (s/to-root e) [:.lang-button])
                         clojure-button (s/select (s/to-root e) [:#clojure])]
                     (s/config! exec-btn
                                :text (if (= :download name)
                                        (utils/get-string :clone-project)
                                        (utils/get-string :create-project)))
                     (s/config! package-panel :visible? (not= :download name))
                     (s/config! download-panel :visible? (= :download name))
                     (s/config! lang-buttons :enabled? (> (count langs) 1))
                     (doseq [b lang-buttons]
                       (s/config! b
                                  :visible? (contains? (set langs) (s/id-of b))
                                  :selected? (= (s/id-of b) (first langs))))))
        finish (fn []
                 {:project-type (->> [(s/selection group)
                                      (s/selection lang-group)]
                                     (map #(name (s/id-of %)))
                                     (string/join "-")
                                     keyword)
                  :project-name project-name
                  :package-name (when (s/config package-panel :visible?)
                                  (utils/format-package-name
                                    (s/text package-text)))
                  :address (when (s/config download-panel :visible?)
                             (s/text download-text))
                  :project-dir (.getCanonicalPath
                                 (io/file parent-dir project-name))})
        buttons (for [[id template-ids] types]
                  (doto (s/radio :id id
                                 :text (str "<html>"
                                            "<center>"
                                            (utils/get-string id) "<br>"
                                            "</center>")
                                 :group group
                                 :selected? (= id :console)
                                 :listen [:action refresh!]
                                 :valign :center
                                 :halign :center)
                        (.setSelectedIcon (icon/icon (str (name id) "2.png")))
                        (.setIcon (icon/icon (str (name id) ".png")))
                        (.setVerticalTextPosition JRadioButton/BOTTOM)
                        (.setHorizontalTextPosition JRadioButton/CENTER)))]
    (s/config! exec-btn :listen [:action #(s/return-from-dialog % (finish))])
    (-> (s/dialog
          :title (utils/get-string :specify-project-type)
          :content (s/vertical-panel
                     :items [(s/grid-panel :columns (/ (count types) 2)
                                           :items buttons)
                             package-panel
                             download-panel
                             lang-panel])
          :options [exec-btn])
        s/pack!
        center!
        stay-on-top!
        s/show!)))

(defn show-close-file-dialog!
  [unsaved-paths]
  (-> (s/dialog :content (utils/get-unsaved-paths-message unsaved-paths)
                :options [(s/button :text (utils/get-string :close)
                                    :listen [:action
                                             #(s/return-from-dialog % true)])
                          (s/button :text (utils/get-string :cancel)
                                    :listen [:action
                                             #(s/return-from-dialog % false)])])
      s/pack!
      center!
      stay-on-top!
      s/show!))

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
      stay-on-top!
      s/show!))

(defn show-input-dialog!
  [text secure?]
  (let [input (doto (if secure?
                      (s/password :columns 20)
                      (s/text :columns 20))
                (ui/text-prompt! text)
                (utils/set-accessible-name! text))]
    (-> (s/dialog :content (s/vertical-panel :items [input])
                  :options [(s/button :text (utils/get-string :continue)
                                      :listen [:action
                                               #(->> (s/text input)
                                                     (s/return-from-dialog %))])
                            (s/button :text (utils/get-string :cancel)
                                      :listen [:action
                                               #(s/return-from-dialog % nil)])])
        s/pack!
        center!
        stay-on-top!
        s/show!)))

(defn show-boolean-dialog!
  [text]
  (let [text-panel (s/flow-panel :items [text])
        group (s/button-group)
        input (s/horizontal-panel :items
                                  [(s/radio :id :yes
                                            :text (utils/get-string :yes)
                                            :group group
                                            :selected? true)
                                   (s/radio :id :no
                                            :text (utils/get-string :no)
                                            :group group)])]
    (-> (s/dialog :content (s/vertical-panel :items [text-panel input])
                  :options [(s/button :text (utils/get-string :continue)
                                      :listen [:action
                                               #(->> (s/selection group)
                                                     s/id-of
                                                     (= :yes)
                                                     (s/return-from-dialog %))])
                            (s/button :text (utils/get-string :cancel)
                                      :listen [:action
                                               #(s/return-from-dialog % nil)])])
        s/pack!
        center!
        stay-on-top!
        s/show!)))

(defn progress-dialog
  []
  (-> (s/dialog :content (s/vertical-panel
                           :items [(s/label :id :description)
                                   [:fill-v 5]
                                   (s/progress-bar :id :progress-bar)])
                :options [(s/button :text (utils/get-string :cancel)
                                    :listen [:action
                                             #(s/return-from-dialog % true)])])
      s/pack!
      center!
      stay-on-top!))
