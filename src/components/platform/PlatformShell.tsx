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
import { AdminView } from "./AdminView";
import { CommandPalette } from "./CommandPalette";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Minimize2, Maximize2, Activity, AlertTriangle as AlertIcon } from "lucide-react";
import "@/components/admin/nostalgic.css";

export function PlatformShell() {
  const [activeState, setActiveState] = useState<AppState>("configure");
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [investigateSignal, setInvestigateSignal] = useState<string | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);

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
    onSearch: () => setCommandOpen(true),
    onSave: () => {},
    onRunSimulation: () => {},
  });

  const stateLabels: Record<AppState, string> = {
    live: "MONITOR",
    investigate: "INVESTIGATE",
    analyze: "TRACE",
    configure: "CONFIGURE",
    govern: "DEPLOY",
    admin: "MANAGE",
  };

  return (
    <div className={`nostalgic-scope h-screen flex flex-col bg-background text-foreground ${density === "compact" ? "density-compact" : ""}`}>
      {/* System status header */}
      <div className="h-10 flex items-center justify-between px-4 border-b border-border bg-card text-xs select-none shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-[10px] font-bold">T</span>
            </div>
            <span className="font-semibold text-foreground tracking-tight text-[12px]">
              Telemetry Studio
            </span>
          </div>
          <div className="w-px h-4 bg-border" />
          <span className="text-[11px] text-muted-foreground">{defaultContext.environment}</span>
          <div className="w-px h-4 bg-border" />
          {/* System status */}
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <div className="w-1.5 h-1.5 rounded-full bg-warning" />
            </div>
            <span className="text-[11px] text-warning font-medium">Degraded</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <ContextBar context={defaultContext} />
          <div className="w-px h-4 bg-border" />
          <span className="flex items-center gap-1.5 font-mono text-[10px]">
            <Activity className="w-3 h-3 text-primary" />
            124 sig/s
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            {totalActive} active
          </span>
          {totalErrors > 0 && (
            <span className="flex items-center gap-1.5">
              <AlertIcon className="w-3 h-3 text-destructive" />
              {totalErrors} errors
            </span>
          )}
          <div className="w-px h-4 bg-border" />
          <button
            onClick={() => setDensity(d => d === "comfortable" ? "compact" : "comfortable")}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-accent transition-colors"
          >
            {density === "comfortable" ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            <span className="text-[10px]">{density === "comfortable" ? "Compact" : "Comfortable"}</span>
          </button>
          <span className="text-[10px] text-muted-foreground/40">v2.4.1</span>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex min-h-0">
        <GlobalNav activeState={activeState} onStateChange={setActiveState} />

        <div className="flex-1 flex flex-col min-h-0 min-w-0">
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
          {activeState === "admin" && <AdminView />}
        </div>
      </div>

      {/* Status bar */}
      <div className="h-6 flex items-center justify-between px-4 border-t border-border bg-card text-[10px] text-muted-foreground select-none shrink-0">
        <div className="flex items-center gap-4">
          <span className="uppercase tracking-wider font-semibold text-foreground/60">
            {stateLabels[activeState]}
          </span>
          <span>UTC+3</span>
        </div>
        <div className="flex items-center gap-4 font-mono">
          <span>⌘K Search</span>
          <span>⌘I Debug</span>
          <span>⌘S Save</span>
          <span>F12 Go to def</span>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onNavigate={(state) => setActiveState(state)}
      />
    </div>
  );
}
