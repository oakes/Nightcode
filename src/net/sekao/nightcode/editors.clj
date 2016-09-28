(ns net.sekao.nightcode.editors
  (:require [clojure.java.io :as io]
            [clojure.edn :as edn]
            [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.content-type :refer [wrap-content-type]]
            [ring.util.response :refer [redirect]]
            [ring.util.request :refer [body-string]]
            [clojure.spec :as s :refer [fdef]]
            [net.sekao.nightcode.shortcuts :as shortcuts]
            [net.sekao.nightcode.utils :as u]
            [net.sekao.nightcode.spec :as spec]
            [eval-soup.core :as es])
  (:import [javafx.fxml FXMLLoader]
           [javafx.scene.web WebEngine]
           [java.io File]))

(def ^:const clojure-exts #{"boot" "clj" "cljc" "cljs" "cljx" "edn" "pxi"})
(def ^:const wrap-exts #{"md" "txt"})
(def ^:const max-file-size (* 1024 1024 2))

(defn form->serializable [form]
  (if (instance? Exception form)
    [(.getMessage form)]
    (pr-str form)))

(defn eval-forms [forms-str]
  (->> forms-str
       edn/read-string
       es/code->results
       (mapv form->serializable)))

(defn handler [request]
  (case (:uri request)
    "/" (redirect "/paren-soup.html")
    "/eval" {:status 200
             :headers {"Content-Type" "text/plain"}
             :body (pr-str (eval-forms (body-string request)))}
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

(definterface Bridge
  (onload [])
  (onautosave [])
  (onchange [])
  (onenter [text]))

(defn update-editor-buttons! [pane ^WebEngine engine]
  (.setDisable (.lookup pane "#save") (.executeScript engine "isClean()"))
  (.setDisable (.lookup pane "#undo") (not (.executeScript engine "canUndo()")))
  (.setDisable (.lookup pane "#redo") (not (.executeScript engine "canRedo()"))))

(defn onload [^WebEngine engine ^File file pref-state]
  (-> engine
      (.executeScript "window")
      (.call "setTextContent" (into-array [(u/remove-returns (slurp file))])))
  (doto engine
    (.executeScript "init()")
    (.executeScript (case (:theme pref-state)
                      :dark "changeTheme(true)"
                      :light "changeTheme(false)"))
    (.executeScript (format "setTextSize(%s)" (:text-size pref-state)))))

(defn should-open? [^File file]
  (-> file .length (< max-file-size)))

(def ^:const ids [:#up :#save :#undo :#redo :#instarepl :#find :#close])

(defn editor-pane [pref-state-atom runtime-state ^File file]
  (when (should-open? file)
    (let [pane (FXMLLoader/load (io/resource "editor.fxml"))
          webview (-> pane .getChildren (.get 1))
          engine (.getEngine webview)
          clojure? (-> file .getName u/get-extension clojure-exts some?)]
      (.setContextMenuEnabled webview false)
      (-> pane (.lookup "#instarepl") (.setManaged clojure?))
      (shortcuts/add-tooltips! pane ids)
      (-> engine
          (.executeScript "window")
          (.setMember "java"
            (proxy [Bridge] []
              (onload []
                (try
                  (onload engine file @pref-state-atom)
                  (catch Exception e (.printStackTrace e))))
              (onautosave []
                (try
                  (let [save-btn (.lookup pane "#save")]
                    (when (and (:auto-save? @pref-state-atom)
                               (not (.isDisabled save-btn)))
                      (.fire save-btn)))
                  (catch Exception e (.printStackTrace e))))
              (onchange []
                (try
                  (update-editor-buttons! pane engine)
                  (catch Exception e (.printStackTrace e))))
              (onenter [text]))))
      (.load engine (str "http://localhost:"
                      (:web-port runtime-state)
                      (if clojure? "/paren-soup.html" "/codemirror.html")))
      pane)))

; specs

(fdef eval-form-safely
  :args (s/cat :form any? :nspace spec/ns?)
  :ret any?)

(fdef eval-form
  :args (s/cat :form-str string? :nspace spec/ns?)
  :ret vector?)

(fdef eval-forms
  :args (s/cat :forms-str string?)
  :ret vector?)

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

(fdef editor-pane
  :args (s/cat :pref-state-atom spec/atom? :runtime-state map? :file spec/file?)
  :ret spec/pane?)

