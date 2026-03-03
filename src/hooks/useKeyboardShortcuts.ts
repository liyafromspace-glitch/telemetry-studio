import { useEffect } from "react";
import { type AppState } from "@/data/mockPlatform";

interface ShortcutActions {
  onSearch?: () => void;
  onStateChange?: (state: AppState) => void;
  onRunSimulation?: () => void;
  onSave?: () => void;
}

export function useKeyboardShortcuts(actions: ShortcutActions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;

      switch (e.key.toLowerCase()) {
        case "k":
          e.preventDefault();
          actions.onSearch?.();
          break;
        case "i":
          e.preventDefault();
          actions.onStateChange?.("investigate");
          break;
        case "f":
          if (!e.shiftKey) {
            // Don't override browser find
          }
          break;
        case "m":
          e.preventDefault();
          actions.onStateChange?.("configure");
          break;
        case "s":
          e.preventDefault();
          actions.onSave?.();
          break;
        case "enter":
          e.preventDefault();
          actions.onRunSimulation?.();
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [actions]);
}
