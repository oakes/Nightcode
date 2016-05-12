(ns net.sekao.nightcode.editors
  (:require [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.content-type :refer [wrap-content-type]]
            [ring.util.response :refer [redirect]]
            [cross-parinfer.core :as cp]
            [html-soup.core :as hs])
  (:import [netscape.javascript JSObject]))

(defn handler [request]
  (when (= (:uri request) "/")
    (redirect "/index.html")))

(defn start-web-server! []
  (-> handler
      (wrap-resource "public")
      (wrap-content-type)
      (run-jetty {:port 0 :join? false})
      .getConnectors
      (aget 0)
      .getLocalPort))

(definterface Bridge
  (addParinfer [mode-type state])
  (addIndent [state])
  (codeToHtml [text]))

(defn map->obj! [obj {:keys [text cursor-position indent-type]}]
  (doto obj
    (.setMember "text" text)
    (.setMember "startPos" (first cursor-position))
    (.setMember "endPos" (second cursor-position))
    (.setMember "indentType" (some-> indent-type name))))

(defn obj->map [obj]
  {:text (.getMember obj "text")
   :cursor-position [(.getMember obj "startPos") (.getMember obj "endPos")]
   :indent-type (some-> (.getMember obj "indentType") keyword)})

(defn create-bridge []
  (proxy [Bridge] []
    (addParinfer [mode-type state]
      (map->obj! state (cp/add-parinfer (keyword mode-type) (obj->map state))))
    (addIndent [state]
      (map->obj! state (cp/add-indent (obj->map state))))
    (codeToHtml [text]
      (hs/code->html text))))
