(ns nightcode.editors
  (:require [clojure.java.io :as io]
            [clojure.edn :as edn]
            [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.content-type :refer [wrap-content-type]]
            [ring.util.response :refer [redirect]]
            [ring.util.request :refer [body-string]]
            [clojure.spec.alpha :as s :refer [fdef]]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.utils :as u]
            [nightcode.spec :as spec]
            [eval-soup.core :as es]
            [hawk.core :as hawk])
  (:import [javafx.fxml FXMLLoader]
           [javafx.scene.web WebEngine]
           [javafx.application Platform]
           [java.io File]
           [nightcode.utils Bridge]))

(def ^:const clojure-exts #{"boot" "clj" "cljc" "cljs" "cljx" "edn" "pxi" "hl"})
(def ^:const instarepl-exts #{"clj" "cljc"})
(def ^:const wrap-exts #{"md" "txt"})
(def ^:const max-file-size (* 1024 1024 2))

(defn form->serializable [form]
  (if (instance? Exception form)
    [(.getMessage form)]
    (pr-str form)))

(defn handler [request]
  (case (:uri request)
    "/" (redirect "/paren-soup.html")
    "/eval" {:status 200
             :headers {"Content-Type" "text/plain"}
             :body (->> request
                        body-string
                        edn/read-string
                        es/code->results
                        (mapv form->serializable)
                        pr-str)}
    nil))

(defn start-web-server! []
  (-> handler
      (wrap-resource "public")
      (wrap-content-type)
      (run-jetty {:port 0 :join? false})
      .getConnectors
      (aget 0)
      .getLocalPort))

(defn remove-editor! [^String path pane runtime-state-atom]
  (swap! runtime-state-atom update :editor-panes dissoc path)
  (swap! runtime-state-atom update :bridges dissoc path)
  (shortcuts/hide-tooltips! pane)
  (some-> pane .getParent .getChildren (.remove pane)))

(defn remove-editors! [^String path runtime-state-atom]
  (doseq [[editor-path pane] (:editor-panes @runtime-state-atom)]
    (when (u/parent-path? path editor-path)
      (remove-editor! editor-path pane runtime-state-atom))))

(defn remove-non-existing-editors! [runtime-state-atom]
  (doseq [[editor-path pane] (:editor-panes @runtime-state-atom)]
    (when-not (.exists (io/file editor-path))
      (remove-editor! editor-path pane runtime-state-atom))))

(defn toggle-instarepl! [^WebEngine engine selected?]
  (if selected?
    (.executeScript engine "showInstaRepl()")
    (.executeScript engine "hideInstaRepl()")))

(defn update-editor-buttons! [pane ^WebEngine engine]
  (.setDisable (.lookup pane "#save") (.executeScript engine "isClean()"))
  (.setDisable (.lookup pane "#undo") (not (.executeScript engine "canUndo()")))
  (.setDisable (.lookup pane "#redo") (not (.executeScript engine "canRedo()"))))

(defn onload [^WebEngine engine ^File file pref-state]
  (-> engine
      (.executeScript "window")
      (.call "setTextContent" (into-array [(u/remove-returns (slurp file))])))
  (doto engine
    (.executeScript (format "init('%s')" (-> file .getName u/get-extension)))
    (.executeScript (case (:theme pref-state)
                      :dark "changeTheme(true)"
                      :light "changeTheme(false)"))
    (.executeScript (format "setTextSize(%s)" (:text-size pref-state)))))

(defn should-open? [^File file]
  (-> file .length (< max-file-size)))

(def ^:const ids [:#up :#save :#undo :#redo :#instarepl :#find :#close])

(defn save-file! [^String path ^WebEngine engine]
  (spit (io/file path) (.executeScript engine "getTextContent()"))
  (.executeScript engine "markClean()"))

(defn editor-pane [pref-state-atom runtime-state-atom ^File file]
  (when (should-open? file)
    (let [runtime-state @runtime-state-atom
          pane (FXMLLoader/load (io/resource "editor.fxml"))
          webview (-> pane .getChildren (.get 1))
          engine (.getEngine webview)
          clojure? (-> file .getName u/get-extension clojure-exts some?)
          instarepl? (-> file .getName u/get-extension instarepl-exts some?)
          path (.getCanonicalPath file)
          bridge (reify Bridge
                   (onload [this]
                     (try
                       (onload engine file @pref-state-atom)
                       (catch Exception e (.printStackTrace e))))
                   (onautosave [this]
                     (try
                       (let [save-btn (.lookup pane "#save")]
                         (when (and (:auto-save? @pref-state-atom)
                                    (not (.isDisabled save-btn)))
                           (save-file! path engine)))
                       (catch Exception e (.printStackTrace e))))
                   (onchange [this]
                     (try
                       (update-editor-buttons! pane engine)
                       (catch Exception e (.printStackTrace e))))
                   (onenter [this text]))]
      (.setContextMenuEnabled webview false)
      (-> pane (.lookup "#instarepl") (.setManaged instarepl?))
      (shortcuts/add-tooltips! pane ids)
      ; prevent bridge from being GC'ed
      (swap! runtime-state-atom update :bridges assoc path bridge)
      (-> engine
          (.executeScript "window")
          (.setMember "java" bridge))
      (.load engine (str "http://localhost:"
                      (:web-port runtime-state)
                      (if clojure? "/paren-soup.html" "/codemirror.html")))
      pane)))

(defn get-bridge [pref-state runtime-state]
  (when-let [project-path (u/get-project-path pref-state)]
    (get-in runtime-state [:bridges project-path])))

(defn create-file-watcher [project-dir runtime-state-atom]
  (hawk/watch! [{:paths [project-dir]
                 :handler (fn [ctx {:keys [file]}]
                            (when (.exists file)
                              (when-let [editor (get-in @runtime-state-atom [:editor-panes (.getCanonicalPath file)])]
                                (Platform/runLater
                                  (fn []
                                    (when-let [webview (.lookup editor "#webview")]
                                      (when (-> (.getEngine webview)
                                                (.executeScript "getSavedText()")
                                                u/remove-returns
                                                (not= (u/remove-returns (slurp file))))
                                        (-> (.getEngine webview)
                                            (.executeScript "openModal()"))))))))
                            ctx)}]))

; specs

(fdef form->serializable
  :args (s/cat :form any?)
  :ret (s/or :error vector? :value string?))

(fdef handler
  :args (s/cat :request map?)
  :ret (s/nilable map?))

(fdef start-web-server!
  :args (s/cat)
  :ret integer?)

(fdef remove-editor!
  :args (s/cat :path string? :pane spec/pane? :runtime-state-atom spec/atom?))

(fdef remove-editors!
  :args (s/cat :path string? :runtime-state-atom spec/atom?))

(fdef remove-non-existing-editors!
  :args (s/cat :runtime-state-atom spec/atom?))

(fdef toggle-instarepl!
  :args (s/cat :engine any? :selected? boolean?))

(fdef update-editor-buttons!
  :args (s/cat :pane spec/pane? :engine any?))

(fdef onload
  :args (s/cat :engine any? :file spec/file? :pref-state map?))

(fdef should-open?
  :args (s/cat :file spec/file?)
  :ret boolean?)

(fdef save-file!
  :args (s/cat :path string? :engine any?))

(fdef editor-pane
  :args (s/cat :pref-state-atom spec/atom? :runtime-state-atom spec/atom? :file spec/file?)
  :ret spec/pane?)

(fdef get-bridge
  :args (s/cat :pref-state map? :runtime-state map?)
  :ret (s/nilable #(instance? Bridge %)))

(fdef create-file-watcher
  :args (s/cat :project-dir string? :runtime-state-atom spec/atom?))

