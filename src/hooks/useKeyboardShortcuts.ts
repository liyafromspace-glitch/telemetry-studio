import { useEffect } from "react";
import { type AppState } from "@/data/mockPlatform";

interface ShortcutActions {
  onSearch?: () => void;
  onStateChange?: (state: AppState) => void;
  onRunSimulation?: () => void;
  onSave?: () => void;
  onEscape?: () => void;
  onGoToDefinition?: () => void;
  onFindUsages?: () => void;
}

export function useKeyboardShortcuts(actions: ShortcutActions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;

      // Escape — always available
      if (e.key === "Escape") {
        actions.onEscape?.();
        return;
      }

      // F12 — Go to definition
      if (e.key === "F12") {
        e.preventDefault();
        actions.onGoToDefinition?.();
        return;
      }

      if (!meta) return;

      // ⌘⇧F — Find usages
      if (e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        actions.onFindUsages?.();
        return;
      }

      switch (e.key.toLowerCase()) {
        case "k":
          e.preventDefault();
          actions.onSearch?.();
          break;
        case "i":
          e.preventDefault();
          actions.onStateChange?.("investigate");
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
