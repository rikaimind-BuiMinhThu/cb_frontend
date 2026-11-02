import { useEffect, useRef } from "react";
import { isMobile } from "../Utils";
import { postMessageToParent } from "v2/views/Preview/PreviewFukushashiki/LPUtils";

const FOCUSABLE_FIELD_SELECTOR = "input, textarea, select";

const scrollFocusedFieldIntoChatBody = () => {
  const active = document.activeElement;
  if (!active || typeof active.matches !== "function") return;
  if (!active.matches(FOCUSABLE_FIELD_SELECTOR)) return;

  const chatBody = document.getElementById("sp-body");
  if (!chatBody || !chatBody.contains(active)) return;

  active.scrollIntoView({ block: "nearest", behavior: "auto" });
};

const scheduleFocusedFieldScroll = () => {
  window.requestAnimationFrame(() => {
    scrollFocusedFieldIntoChatBody();
  });
};

/**
 * Mobile body class, parent message listener, and initial open-state sync.
 * Mode-specific eventHandler stays in the parent component.
 * Listener rebinds when state.isOpen changes (matches legacy behavior).
 */
export const usePreviewParentSync = ({
  state,
  eventHandler,
  hasSentInitialOpenStateToParent,
  enabled = true,
  listenToParent = true,
  syncInitialOpen = true,
}) => {
  const eventHandlerRef = useRef(eventHandler);
  eventHandlerRef.current = eventHandler;

  useEffect(() => {
    if (!enabled) return;
    if (isMobile()) {
      document.body.classList.add("is_mobile");
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !isMobile()) return undefined;

    const onFocusIn = (event) => {
      const target = event.target;
      if (!target || typeof target.matches !== "function") return;
      if (!target.matches(FOCUSABLE_FIELD_SELECTOR)) return;
      scheduleFocusedFieldScroll();
    };

    const onViewportChange = () => {
      scheduleFocusedFieldScroll();
    };

    document.addEventListener("focusin", onFocusIn);
    window.addEventListener("resize", onViewportChange);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onViewportChange);
      window.visualViewport.addEventListener("scroll", onViewportChange);
    }

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("resize", onViewportChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onViewportChange);
        window.visualViewport.removeEventListener("scroll", onViewportChange);
      }
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !listenToParent) return;
    const handler = (event) => eventHandlerRef.current?.(event);
    window.addEventListener("message", handler, false);
    return () => {
      window.removeEventListener("message", handler);
    };
  }, [enabled, listenToParent, state.isOpen]);

  useEffect(() => {
    if (!enabled || !syncInitialOpen) return;
    if (!hasSentInitialOpenStateToParent) return;
    if (hasSentInitialOpenStateToParent.current) return;
    if (!state.loadedStateFromSession) return;
    if (!state.botInfor) return;
    if (typeof state.isOpen !== "boolean") return;
    if (!state.deviceReceive || !state.urlReceive) return;

    postMessageToParent({ isOpen: state.isOpen }, state);
    hasSentInitialOpenStateToParent.current = true;
  }, [
    enabled,
    syncInitialOpen,
    hasSentInitialOpenStateToParent,
    state.loadedStateFromSession,
    state.botInfor,
    state.isOpen,
    state.deviceReceive,
    state.urlReceive,
    state,
  ]);
};
