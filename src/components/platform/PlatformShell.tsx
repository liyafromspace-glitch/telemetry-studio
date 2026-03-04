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
import { Activity, Minimize2, Maximize2 } from "lucide-react";

export function PlatformShell() {
  const [activeState, setActiveState] = useState<AppState>("configure");
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
      const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Поиск"]');
      searchInput?.focus();
    },
  });

  return (
    <div className={`h-screen flex flex-col bg-background text-foreground ${density === "compact" ? "density-compact" : ""}`}>
      {/* Top header bar */}
      <div className="h-10 flex items-center justify-between px-3 border-b border-border glass-surface text-xs select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground tracking-tight">
              Industrial Telemetry Platform
            </span>
          </div>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-muted-foreground text-[11px]">{defaultContext.environment}</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <ContextBar context={defaultContext} />
          <div className="w-px h-4 bg-border" />
          <span className="flex items-center gap-1.5">
            <span className="status-dot status-active" />
            <span>{totalActive} активных</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="status-dot status-error" />
            <span>{totalErrors} ошибок</span>
          </span>
          <div className="w-px h-4 bg-border" />
          <button
            onClick={() => setDensity(d => d === "comfortable" ? "compact" : "comfortable")}
            className="flex items-center gap-1 px-2 py-1 rounded-sm hover:bg-accent transition-colors"
            title={density === "comfortable" ? "Компактный режим" : "Комфортный режим"}
          >
            {density === "comfortable" ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
            <span className="text-[10px]">{density === "comfortable" ? "Компактный" : "Комфортный"}</span>
          </button>
          <span className="text-[10px] text-muted-foreground/60">v2.4.1</span>
        </div>
      </div>

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
      <div className="h-6 flex items-center justify-between px-3 border-t border-border glass-surface text-[10px] text-muted-foreground select-none">
        <div className="flex items-center gap-4">
          <span className="uppercase tracking-wider font-semibold text-foreground/70">
            {activeState.toUpperCase()}
          </span>
          <span>UTC+3</span>
          <span>{density === "compact" ? "▪ Компактный" : "▫ Комфортный"}</span>
          <span className="text-muted-foreground/50">·</span>
          <div className="flex items-center gap-2">
            <span className="btn-secondary !py-0 !px-1.5 !text-[9px] cursor-default">Проверить ▾</span>
            <span className="btn-secondary !py-0 !px-1.5 !text-[9px] cursor-default">Сохранить ▾</span>
            <span className="btn-secondary !py-0 !px-1.5 !text-[9px] cursor-default">Активировать ▾</span>
          </div>
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
