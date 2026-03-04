import { useState } from "react";
import { Rule } from "@/data/mockRules";
import { RuleOverview } from "./RuleOverview";
import { DependencyGraph } from "./DependencyGraph";
import { SimulationPanel } from "./SimulationPanel";
import { VersionHistory } from "./VersionHistory";
import { ActivationModal } from "./ActivationModal";
import { ChevronRight, ChevronDown, Save, Zap, CheckCircle } from "lucide-react";

interface CenterPanelProps {
  rule: Rule;
}

const tabs = [
  { id: "overview", label: "Обзор" },
  { id: "dependencies", label: "Зависимости" },
  { id: "simulation", label: "Симуляции" },
  { id: "history", label: "История версий" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function CenterPanel({ rule }: CenterPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showActivation, setShowActivation] = useState(false);

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* Breadcrumb + actions */}
      <div className="flex items-center justify-between px-4 py-2 border-b glass-toolbar">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer transition-colors">Производственная среда</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-foreground cursor-pointer transition-colors flex items-center gap-0.5">
            {rule.category}
            <ChevronDown className="w-2.5 h-2.5" />
          </span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-semibold">{rule.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="btn-secondary">
            <CheckCircle className="w-3 h-3" />
            Проверить
          </button>
          <button className="btn-secondary">
            <Save className="w-3 h-3" />
            Сохранить
          </button>
          <button
            onClick={() => setShowActivation(true)}
            className="btn-primary"
          >
            <Zap className="w-3 h-3" />
            Активировать
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b glass-toolbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium transition-all duration-150 relative ${
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary animate-scale-in" 
                style={{ transformOrigin: 'center bottom' }} />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto bg-background" key={activeTab}>
        <div className="tab-content-enter">
          {activeTab === "overview" && <RuleOverview rule={rule} />}
          {activeTab === "dependencies" && <DependencyGraph rule={rule} />}
          {activeTab === "simulation" && <SimulationPanel rule={rule} />}
          {activeTab === "history" && <VersionHistory rule={rule} />}
        </div>
      </div>

      {showActivation && (
        <ActivationModal
          rule={rule}
          onClose={() => setShowActivation(false)}
          onActivate={() => {}}
        />
      )}
    </div>
  );
}
