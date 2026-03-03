import { useState, useCallback } from "react";
import { type AppState, defaultContext } from "@/data/mockPlatform";
import { rules } from "@/data/mockRules";
import { matrices } from "@/data/mockMatrices";
import { GlobalNav } from "./GlobalNav";
import { ContextBar } from "./ContextBar";
import { LiveView } from "./LiveView";
import { InvestigateView } from "./InvestigateView";
import { AnalyzeView } from "./AnalyzeView";
import { ConfigureView } from "./ConfigureView";
import { GovernView } from "./GovernView";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Activity, Layers, Minimize2 } from "lucide-react";

export function PlatformShell() {
  const [activeState, setActiveState] = useState<AppState>("live");
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [investigateSignal, setInvestigateSignal] = useState<string | null>(null);

  const totalActive =
    rules.filter((r) => r.status === "active").length +
    matrices.filter((m) => m.status === "active").length;
  const totalErrors =
    rules.filter((r) => r.status === "error").length +
    matrices.filter((m) => m.status === "error").length;

  const handleNavigateToInvestigate = useCallback((signalParam?: string) => {
    if (signalParam) setInvestigateSignal(signalParam);
    setActiveState("investigate");
  }, []);

  useKeyboardShortcuts({
    onStateChange: setActiveState,
    onSearch: () => {
      // Focus search input if available
      const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Поиск"]');
      searchInput?.focus();
    },
  });

  return (
    <div className={`h-screen flex flex-col bg-background text-foreground ${density === "compact" ? "density-compact" : ""}`}>
      {/* Top bar */}
      <div className="h-9 flex items-center justify-between px-3 border-b border-border bg-card text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground tracking-tight">
            Industrial Telemetry Platform
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{defaultContext.environment}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="status-dot status-active" />
            {totalActive} активных
          </span>
          <span className="flex items-center gap-1">
            <span className="status-dot status-error" />
            {totalErrors} ошибок
          </span>
          {/* Density toggle */}
          <button
            onClick={() => setDensity(d => d === "comfortable" ? "compact" : "comfortable")}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm hover:bg-accent transition-colors"
            title={density === "comfortable" ? "Компактный режим" : "Комфортный режим"}
          >
            {density === "comfortable" ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Layers className="w-3 h-3" />
            )}
            <span className="text-[9px]">{density === "comfortable" ? "Компактный" : "Комфортный"}</span>
          </button>
          <span>v2.4.1</span>
        </div>
      </div>

      {/* Context bar */}
      <ContextBar context={defaultContext} />

      {/* Main area */}
      <div className="flex-1 flex min-h-0">
        <GlobalNav activeState={activeState} onStateChange={setActiveState} />

        {activeState === "live" && (
          <LiveView onNavigateToInvestigate={handleNavigateToInvestigate} />
        )}
        {activeState === "investigate" && (
          <InvestigateView
            onNavigateToConfigure={() => setActiveState("configure")}
            initialSignal={investigateSignal}
          />
        )}
        {activeState === "analyze" && (
          <AnalyzeView onNavigateToInvestigate={() => setActiveState("investigate")} />
        )}
        {activeState === "configure" && <ConfigureView />}
        {activeState === "govern" && (
          <GovernView onNavigateToAnalyze={() => setActiveState("analyze")} />
        )}
      </div>

      {/* Status bar */}
      <div className="h-6 flex items-center justify-between px-3 border-t border-border bg-card text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="uppercase tracking-wider font-medium">
            {activeState === "live" ? "LIVE" :
             activeState === "investigate" ? "INVESTIGATE" :
             activeState === "analyze" ? "ANALYZE" :
             activeState === "configure" ? "CONFIGURE" : "GOVERN"}
          </span>
          <span>UTC+3</span>
          <span className="text-[9px]">{density === "compact" ? "▪ Компактный" : "▫ Комфортный"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>⌘K Поиск</span>
          <span>⌘I Инцидент</span>
          <span>⌘M Конфигурация</span>
          <span>⌘S Сохранить</span>
        </div>
      </div>
    </div>
  );
}
