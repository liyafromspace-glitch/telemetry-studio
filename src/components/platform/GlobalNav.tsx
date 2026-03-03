import { type AppState } from "@/data/mockPlatform";
import { Radio, Search as SearchIcon, BarChart3, Settings2, Shield } from "lucide-react";

interface GlobalNavProps {
  activeState: AppState;
  onStateChange: (state: AppState) => void;
}

const navItems: { state: AppState; icon: typeof Radio; label: string }[] = [
  { state: "live", icon: Radio, label: "LIVE" },
  { state: "investigate", icon: SearchIcon, label: "INVESTIGATE" },
  { state: "analyze", icon: BarChart3, label: "ANALYZE" },
  { state: "configure", icon: Settings2, label: "CONFIGURE" },
  { state: "govern", icon: Shield, label: "GOVERN" },
];

const stateAccentColors: Record<AppState, string> = {
  live: "var(--destructive)",
  investigate: "var(--warning)",
  analyze: "var(--warning)",
  configure: "var(--primary)",
  govern: "270 60% 65%",
};

export function GlobalNav({ activeState, onStateChange }: GlobalNavProps) {
  return (
    <div className="w-12 min-w-12 bg-card border-r border-border flex flex-col items-center py-2 gap-0.5">
      {navItems.map(({ state, icon: Icon, label }) => {
        const isActive = activeState === state;
        return (
          <button
            key={state}
            onClick={() => onStateChange(state)}
            className={`relative w-10 h-11 flex flex-col items-center justify-center gap-0.5 rounded-sm transition-all ${
              isActive
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
            title={label}
          >
            {isActive && (
              <div
                className="absolute left-0 top-2 bottom-2 w-[2px] rounded-r"
                style={{
                  backgroundColor: state === "govern"
                    ? `hsl(${stateAccentColors[state]})`
                    : `hsl(${stateAccentColors[state]})`
                }}
              />
            )}
            <Icon className="w-4 h-4" />
            <span className="text-[7px] font-semibold tracking-wider">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
