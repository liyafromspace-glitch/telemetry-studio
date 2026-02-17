import { useState } from "react";
import { Rule } from "@/data/mockRules";
import { RuleOverview } from "./RuleOverview";
import { DependencyGraph } from "./DependencyGraph";
import { SimulationPanel } from "./SimulationPanel";
import { VersionHistory } from "./VersionHistory";
import { ActivationModal } from "./ActivationModal";
import { ChevronRight, Save, PlayCircle, Zap, CheckCircle } from "lucide-react";

interface CenterPanelProps {
  rule: Rule;
}

const tabs = [
  { id: "overview", label: "Обзор" },
  { id: "dependencies", label: "Зависимости" },
  { id: "simulation", label: "Симуляция" },
  { id: "history", label: "История версий" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function CenterPanel({ rule }: CenterPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showActivation, setShowActivation] = useState(false);

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* Breadcrumb + actions */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Производственная среда</span>
          <ChevronRight className="w-3 h-3" />
          <span>{rule.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{rule.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground bg-secondary rounded-sm transition-colors">
            <CheckCircle className="w-3 h-3" />
            Проверить
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground bg-secondary rounded-sm transition-colors">
            <Save className="w-3 h-3" />
            Сохранить
          </button>
          <button
            onClick={() => setShowActivation(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity"
          >
            <Zap className="w-3 h-3" />
            Активировать
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs transition-colors relative ${
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto bg-background">
        {activeTab === "overview" && <RuleOverview rule={rule} />}
        {activeTab === "dependencies" && <DependencyGraph rule={rule} />}
        {activeTab === "simulation" && <SimulationPanel rule={rule} />}
        {activeTab === "history" && <VersionHistory rule={rule} />}
      </div>

      {/* Activation modal */}
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
