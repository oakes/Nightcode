(ns {{name}}.start
  (:require [{{name}}.{{core-name}} :as c]
            [{{name}}.music :as m]
            [play-cljc.gl.core :as pc])
  (:import  [org.lwjgl.glfw GLFW Callbacks
             GLFWCursorPosCallbackI GLFWKeyCallbackI GLFWMouseButtonCallbackI
             GLFWCharCallbackI GLFWWindowSizeCallbackI]
            [org.lwjgl.opengl GL GL41]
            [org.lwjgl.system MemoryUtil]
            [javax.sound.sampled AudioSystem Clip])
  (:gen-class))

(defn play-music! []
  (doto (AudioSystem/getClip)
    (.open (AudioSystem/getAudioInputStream (m/build-for-clj)))
    (.loop Clip/LOOP_CONTINUOUSLY)
    (.start)))

(defn mousecode->keyword [mousecode]
  (condp = mousecode
    GLFW/GLFW_MOUSE_BUTTON_LEFT :left
    GLFW/GLFW_MOUSE_BUTTON_RIGHT :right
    nil))

(defn on-mouse-move! [window xpos ypos]
  (let [*fb-width (MemoryUtil/memAllocInt 1)
        *fb-height (MemoryUtil/memAllocInt 1)
        *window-width (MemoryUtil/memAllocInt 1)
        *window-height (MemoryUtil/memAllocInt 1)
        _ (GLFW/glfwGetFramebufferSize window *fb-width *fb-height)
        _ (GLFW/glfwGetWindowSize window *window-width *window-height)
        fb-width (.get *fb-width)
        fb-height (.get *fb-height)
        window-width (.get *window-width)
        window-height (.get *window-height)
        width-ratio (/ fb-width window-width)
        height-ratio (/ fb-height window-height)
        x (* xpos width-ratio)
        y (* ypos height-ratio)]
    (MemoryUtil/memFree *fb-width)
    (MemoryUtil/memFree *fb-height)
    (MemoryUtil/memFree *window-width)
    (MemoryUtil/memFree *window-height)
    (swap! c/*state assoc :mouse-x x :mouse-y y)))

(defn on-mouse-click! [window button action mods]
  (swap! c/*state assoc :mouse-button (when (= action GLFW/GLFW_PRESS)
                                        (mousecode->keyword button))))

(defn keycode->keyword [keycode]
  (condp = keycode
    GLFW/GLFW_KEY_LEFT :left
    GLFW/GLFW_KEY_RIGHT :right
    GLFW/GLFW_KEY_UP :up
    GLFW/GLFW_KEY_DOWN :down
    nil))

(defn on-key! [window keycode scancode action mods]
  (when-let [k (keycode->keyword keycode)]
    (condp = action
      GLFW/GLFW_PRESS (swap! c/*state update :pressed-keys conj k)
      GLFW/GLFW_RELEASE (swap! c/*state update :pressed-keys disj k)
      nil)))

(defn on-char! [window codepoint])

(defn on-resize! [window width height])

(defprotocol Events
  (on-mouse-move [this xpos ypos])
  (on-mouse-click [this button action mods])
  (on-key [this keycode scancode action mods])
  (on-char [this codepoint])
  (on-resize [this width height])
  (on-tick [this game]))

(defrecord Window [handle])

(extend-type Window
  Events
  (on-mouse-move [{:keys [handle]} xpos ypos]
    (on-mouse-move! handle xpos ypos))
  (on-mouse-click [{:keys [handle]} button action mods]
    (on-mouse-click! handle button action mods))
  (on-key [{:keys [handle]} keycode scancode action mods]
    (on-key! handle keycode scancode action mods))
  (on-char [{:keys [handle]} codepoint]
    (on-char! handle codepoint))
  (on-resize [{:keys [handle]} width height]
    (on-resize! handle width height))
  (on-tick [this game]
    (c/tick game)))

(defn listen-for-events [{:keys [handle] :as window}]
  (doto handle
    (GLFW/glfwSetCursorPosCallback
      (reify GLFWCursorPosCallbackI
        (invoke [this _ xpos ypos]
          (on-mouse-move window xpos ypos))))
    (GLFW/glfwSetMouseButtonCallback
      (reify GLFWMouseButtonCallbackI
        (invoke [this _ button action mods]
          (on-mouse-click window button action mods))))
    (GLFW/glfwSetKeyCallback
      (reify GLFWKeyCallbackI
        (invoke [this _ keycode scancode action mods]
          (on-key window keycode scancode action mods))))
    (GLFW/glfwSetCharCallback
      (reify GLFWCharCallbackI
        (invoke [this _ codepoint]
          (on-char window codepoint))))
    (GLFW/glfwSetWindowSizeCallback
      (reify GLFWWindowSizeCallbackI
        (invoke [this _ width height]
          (on-resize window width height))))))

(defn ->window []
  (when-not (GLFW/glfwInit)
    (throw (Exception. "Unable to initialize GLFW")))
  (GLFW/glfwWindowHint GLFW/GLFW_VISIBLE GLFW/GLFW_FALSE)
  (GLFW/glfwWindowHint GLFW/GLFW_RESIZABLE GLFW/GLFW_TRUE)
  (GLFW/glfwWindowHint GLFW/GLFW_CONTEXT_VERSION_MAJOR 4)
  (GLFW/glfwWindowHint GLFW/GLFW_CONTEXT_VERSION_MINOR 1)
  (GLFW/glfwWindowHint GLFW/GLFW_OPENGL_FORWARD_COMPAT GL41/GL_TRUE)
  (GLFW/glfwWindowHint GLFW/GLFW_OPENGL_PROFILE GLFW/GLFW_OPENGL_CORE_PROFILE)
  (if-let [window (GLFW/glfwCreateWindow 1024 768 "Hello, world!" 0 0)]
    (do
      (GLFW/glfwMakeContextCurrent window)
      (GLFW/glfwSwapInterval 1)
      (GL/createCapabilities)
      (->Window window))
    (throw (Exception. "Failed to create window"))))

(defn start [game window]
  (let [handle (:handle window)
        game (assoc game :delta-time 0 :total-time 0)]
    (GLFW/glfwShowWindow handle)
    (listen-for-events window)
    (c/init game)
    ; uncomment this to hear music when the game begins!
    ;(play-music!)
    (loop [game game]
      (when-not (GLFW/glfwWindowShouldClose handle)
        (let [ts (GLFW/glfwGetTime)
              game (assoc game
                          :delta-time (- ts (:total-time game))
                          :total-time ts)
              game (on-tick window game)]
          (GLFW/glfwSwapBuffers handle)
          (GLFW/glfwPollEvents)
          (recur game))))
    (Callbacks/glfwFreeCallbacks handle)
    (GLFW/glfwDestroyWindow handle)
    (GLFW/glfwTerminate)))

(defn -main [& args]
  (let [window (->window)]
    (start (pc/->game (:handle window)) window)))

