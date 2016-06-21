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
            [clojail.core :as clojail])
  (:import [javafx.fxml FXMLLoader]
           [javafx.scene.web WebEngine]
           [java.io File StringWriter]))

(def ^:const clojure-exts #{"boot" "clj" "cljc" "cljs" "cljx" "edn" "pxi"})
(def ^:const wrap-exts #{"md" "txt"})
(def ^:const max-file-size (* 1024 1024 2))

(fdef eval-form-safely
  :args (s/cat :form :clojure.spec/any :nspace spec/ns?)
  :ret :clojure.spec/any)
(defn eval-form-safely [form nspace]
  (u/with-security
    (clojail/thunk-timeout
      (fn []
        (binding [*ns* nspace
                  *out* (StringWriter.)]
          (refer-clojure)
          [(eval form)
           (if (and (coll? form) (= 'ns (first form)))
             (-> form second create-ns)
             *ns*)]))
      1000)))

(fdef eval-form
  :args (s/cat :form-str string? :nspace spec/ns?)
  :ret vector?)
(defn eval-form [form-str nspace]
  (binding [*read-eval* false]
    (try
      (eval-form-safely (read-string form-str) nspace)
      (catch Exception e [e nspace]))))

(fdef eval-forms
  :args (s/cat :forms-str string?)
  :ret vector?)
(defn eval-forms [forms-str]
  (loop [forms (edn/read-string forms-str)
         results []
         nspace (create-ns 'clj.user)]
    (if-let [form (first forms)]
      (let [[result current-ns] (eval-form form nspace)
            result-str (if (instance? Exception result) [(.getMessage result)] (pr-str result))]
        (recur (rest forms) (conj results result-str) current-ns))
      results)))

(fdef handler
  :args (s/cat :request map?)
  :ret (s/nilable map?))
(defn handler [request]
  (case (:uri request)
    "/" (redirect "/paren-soup.html")
    "/eval" {:status 200
             :headers {"Content-Type" "text/plain"}
             :body (pr-str (eval-forms (body-string request)))}
    nil))

(fdef start-web-server!
  :args (s/cat)
  :ret integer?)
(defn start-web-server! []
  (-> handler
      (wrap-resource "public")
      (wrap-content-type)
      (run-jetty {:port 0 :join? false})
      .getConnectors
      (aget 0)
      .getLocalPort))

(fdef remove-editors!
  :args (s/cat :path string? :runtime-state-atom spec/atom?))
(defn remove-editors! [^String path runtime-state-atom]
  (doseq [[editor-path pane] (:editor-panes @runtime-state-atom)]
    (when (u/parent-path? path editor-path)
      (swap! runtime-state-atom update :editor-panes dissoc editor-path)
      (shortcuts/hide-tooltips! pane)
      (-> pane .getParent .getChildren (.remove pane)))))

(defn toggle-instarepl! [^WebEngine engine selected?]
  (if selected?
    (.executeScript engine "showInstaRepl()")
    (.executeScript engine "hideInstaRepl()")))

(definterface Bridge
  (onload [])
  (onchange [event])
  (onenter [text])
  (isConsole []))

(fdef update-editor-buttons!
  :args (s/cat :pane spec/pane? :engine :clojure.spec/any))
(defn update-editor-buttons! [pane ^WebEngine engine]
  (.setDisable (.lookup pane "#save") (.executeScript engine "isClean()"))
  (.setDisable (.lookup pane "#undo") (not (.executeScript engine "canUndo()")))
  (.setDisable (.lookup pane "#redo") (not (.executeScript engine "canRedo()"))))

(fdef onload
  :args (s/cat :engine :clojure.spec/any :file spec/file?))
(defn onload [^WebEngine engine ^File file]
  (-> engine
      .getDocument
      (.getElementById "content")
      (.setTextContent (slurp file))))

(fdef should-open?
  :args (s/cat :file spec/file?)
  :ret boolean?)
(defn should-open? [^File file]
  (-> file .length (< max-file-size)))

(fdef editor-pane
  :args (s/cat :runtime-state map? :file spec/file?)
  :ret spec/pane?)
(defn editor-pane [runtime-state ^File file]
  (when (should-open? file)
    (let [pane (FXMLLoader/load (io/resource "editor.fxml"))
          buttons (-> pane .getChildren (.get 0) .getChildren seq)
          webview (-> pane .getChildren (.get 1))
          engine (.getEngine webview)
          clojure? (-> file .getName u/get-extension clojure-exts some?)]
      (.setContextMenuEnabled webview false)
      (-> (filter #(= "instarepl" (.getId %)) buttons)
          first
          (.lookup "#instarepl")
          (.setManaged clojure?))
      (shortcuts/add-tooltips! buttons)
      (-> engine
          (.executeScript "window")
          (.setMember "java"
            (proxy [Bridge] []
              (onload []
                (try
                  (onload engine file)
                  (catch Exception e (.printStackTrace e))))
              (onchange [_]
                (try
                  (update-editor-buttons! pane engine)
                  (catch Exception e (.printStackTrace e))))
              (isConsole []
                false))))
      (.load engine (str "http://localhost:"
                      (:web-port runtime-state)
                      (if clojure? "/paren-soup.html" "/codemirror.html")))
      pane)))
