(ns nightcode.core
  (:use [seesaw.core :only [invoke-later
                            frame
                            native!
                            show!
                            left-right-split
                            top-bottom-split
                            tree
                            tabbed-panel]]
        [clojure.java.io :only [resource
                                input-stream]])
  (:gen-class))

(defn get-window-content []
  (let [text-area (org.fife.ui.rsyntaxtextarea.RSyntaxTextArea.)
        text-area-scroll (org.fife.ui.rtextarea.RTextScrollPane. text-area)
        theme (-> (resource "dark.xml")
                  (input-stream)
                  (org.fife.ui.rsyntaxtextarea.Theme/load))]
    (.apply theme text-area)
    (left-right-split
      (top-bottom-split
        (tree)
        (tabbed-panel :placement :top
                      :overflow :scroll
                      :tabs [])
        :divider-location 0.5)
      text-area-scroll
      :divider-location 0.4)))

(defn -main
  "Launches the main window."
  [& args]
  (native!)
  (org.pushingpixels.substance.api.SubstanceLookAndFeel/setSkin
    (org.pushingpixels.substance.api.skin.GraphiteSkin.))
  (invoke-later
    (-> (frame :title "Nightcode"
               :content (get-window-content)
               :width 1024
               :height 768
               :on-close :exit)
        show!)))
