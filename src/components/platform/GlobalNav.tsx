import { type AppState } from "@/data/mockPlatform";
import { Radio, Bug, BarChart3, Settings2, Shield, Cog } from "lucide-react";

interface GlobalNavProps {
  activeState: AppState;
  onStateChange: (state: AppState) => void;
}

const primaryItems: { state: AppState; icon: typeof Radio; label: string }[] = [
  { state: "live", icon: Radio, label: "Monitor" },
  { state: "investigate", icon: Bug, label: "Investigate" },
  { state: "analyze", icon: BarChart3, label: "Trace" },
  { state: "configure", icon: Settings2, label: "Configure" },
  { state: "govern", icon: Shield, label: "Deploy" },
];

const manageItems: { state: AppState; icon: typeof Radio; label: string }[] = [
  { state: "admin", icon: Cog, label: "Manage" },
];

export function GlobalNav({ activeState, onStateChange }: GlobalNavProps) {
  const renderItem = ({ state, icon: Icon, label }: typeof primaryItems[number]) => {
    const isActive = activeState === state;
    return (
      <button
        key={state}
        onClick={() => onStateChange(state)}
        className={`relative w-10 h-12 flex flex-col items-center justify-center gap-1 rounded-lg transition-all duration-150 ${
          isActive
            ? "bg-accent text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
        }`}
        title={label}
      >
        <Icon className="w-4 h-4" />
        <span className="text-[7px] font-medium tracking-wider uppercase">{label}</span>
      </button>
    );
  };

  return (
    <div className="w-14 min-w-14 bg-card border-r border-border flex flex-col items-center py-3 gap-1">
      {primaryItems.map(renderItem)}
      <div className="w-6 h-px bg-border my-2" />
      {manageItems.map(renderItem)}
    </div>
  );
}
