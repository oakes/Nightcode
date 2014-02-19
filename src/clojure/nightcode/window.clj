(ns nightcode.window
  (:require [nightcode.cli-args :as cli-args]
            [nightcode.dialogs :as dialogs]
            [nightcode.editors :as editors]
            [nightcode.ui :as ui]
            [seesaw.core :as s])
  (:import [java.awt Window]
           [java.awt.event WindowAdapter]
           [java.lang.reflect InvocationHandler Proxy]
           [org.pushingpixels.substance.api SubstanceLookAndFeel]
           [org.pushingpixels.substance.api.skin GraphiteSkin]))

(defn confirm-exit-app!
  "Displays a dialog confirming whether the program should shut down."
  []
  (let [unsaved-paths (->> (keys @editors/editors)
                           (filter editors/is-unsaved?)
                           doall)]
    (if (dialogs/show-shut-down-dialog! unsaved-paths)
      (System/exit 0)
      true)))

(defn enable-full-screen!
  "Enables full screen mode on OS X."
  [window]
  (some-> (try (Class/forName "com.apple.eawt.FullScreenUtilities")
            (catch Exception _))
          (.getMethod "setWindowCanFullScreen"
            (into-array Class [Window Boolean/TYPE]))
          (.invoke nil (object-array [window true]))))

(defn add-listener!
  "Sets callbacks for window events."
  [window]
  ; make sure the window listener is called on OS X
  (when-let [quit-class (try (Class/forName "com.apple.eawt.QuitHandler")
                          (catch Exception _))]
    (some-> (try (Class/forName "com.apple.eawt.Application")
              (catch Exception _))
            (.getMethod "getApplication" (into-array Class []))
            (.invoke nil (object-array []))
            (.setQuitHandler
              (Proxy/newProxyInstance (.getClassLoader quit-class)
                                      (into-array Class [quit-class])
                                      (reify InvocationHandler
                                        (invoke [this proxy method args]))))))
  ; create and add the listener
  (.addWindowListener window
    (proxy [WindowAdapter] []
      (windowActivated [e]
        (ui/update-project-tree!))
      (windowClosing [e]
        (confirm-exit-app!)))))

(defn set-theme!
  "Sets the theme based on the command line arguments."
  [args]
  (s/native!)
  (let [{:keys [shade skin-object theme-resource]} (cli-args/parse-args args)]
    (when theme-resource (reset! editors/theme-resource theme-resource))
    (SubstanceLookAndFeel/setSkin (or skin-object (GraphiteSkin.)))))
