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

const stateAccentClass: Record<AppState, string> = {
  live: "text-destructive",
  investigate: "text-warning",
  analyze: "text-warning",
  configure: "text-primary",
  govern: "text-[hsl(270,60%,65%)]",
};

export function GlobalNav({ activeState, onStateChange }: GlobalNavProps) {
  return (
    <div className="w-14 min-w-14 bg-card border-r border-border flex flex-col items-center py-3 gap-1">
      {navItems.map(({ state, icon: Icon, label }) => {
        const isActive = activeState === state;
        return (
          <button
            key={state}
            onClick={() => onStateChange(state)}
            className={`relative w-10 h-12 flex flex-col items-center justify-center gap-0.5 rounded-sm transition-colors ${
              isActive
                ? `bg-accent ${stateAccentClass[state]}`
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
            title={label}
          >
            {isActive && (
              <div className={`absolute left-0 top-2 bottom-2 w-[2px] rounded-r ${
                state === "live" ? "bg-destructive" :
                state === "investigate" ? "bg-warning" :
                state === "analyze" ? "bg-warning" :
                state === "configure" ? "bg-primary" :
                "bg-[hsl(270,60%,65%)]"
              }`} />
            )}
            <Icon className="w-4 h-4" />
            <span className="text-[7px] font-medium tracking-wider">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
