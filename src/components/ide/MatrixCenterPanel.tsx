import { useState } from "react";
import { Matrix } from "@/data/mockMatrices";
import { MatrixOverview } from "./MatrixOverview";
import { MatrixScopePanel } from "./MatrixScopePanel";
import { MatrixLinksTable } from "./MatrixLinksTable";
import { DependencyGraph } from "./DependencyGraph";
import { SimulationPanel } from "./SimulationPanel";
import { VersionHistory } from "./VersionHistory";
import { ActivationModal } from "./ActivationModal";
import { ChevronRight, Save, Zap, CheckCircle } from "lucide-react";

interface MatrixCenterPanelProps {
  matrix: Matrix;
}

const tabs = [
  { id: "overview", label: "Обзор" },
  { id: "links", label: "Связи" },
  { id: "simulation", label: "Симуляция" },
  { id: "history", label: "История версий" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function MatrixCenterPanel({ matrix }: MatrixCenterPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showActivation, setShowActivation] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [scopeCollapsed, setScopeCollapsed] = useState(false);

  // Adapt matrix to Rule shape for reusable components
  const ruleAdapter = {
    id: matrix.id,
    name: matrix.name,
    parameterType: matrix.matrixType,
    status: matrix.status,
    version: matrix.version,
    author: matrix.author,
    lastCheck: matrix.lastCheck,
    reportsUsed: matrix.reportsUsed,
    parametersLinked: matrix.parametersLinked,
    errorCount: matrix.errorCount,
    warningCount: matrix.warningCount,
    code: "",
    createdAt: matrix.createdAt,
    category: "Матрицы",
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* Breadcrumb + actions */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Производственная среда</span>
          <ChevronRight className="w-3 h-3" />
          <span>Матрицы</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{matrix.name}</span>
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
      <div className="flex border-b border-border bg-card">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium transition-colors relative ${
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
      <div className={`flex-1 ${activeTab === "links" ? "flex" : "overflow-y-auto"} bg-background`}>
        {activeTab === "overview" && <MatrixOverview matrix={matrix} />}
        {activeTab === "links" && (
          <>
            <MatrixScopePanel
              assets={matrix.assets}
              selectedAsset={selectedAsset}
              onSelectAsset={setSelectedAsset}
              collapsed={scopeCollapsed}
              onToggleCollapse={() => setScopeCollapsed(!scopeCollapsed)}
            />
            <MatrixLinksTable rows={matrix.rows} selectedAsset={selectedAsset} />
          </>
        )}
        {activeTab === "simulation" && <SimulationPanel rule={ruleAdapter} />}
        {activeTab === "history" && <VersionHistory rule={ruleAdapter} />}
      </div>

      {/* Activation modal */}
      {showActivation && (
        <ActivationModal
          rule={ruleAdapter}
          onClose={() => setShowActivation(false)}
          onActivate={() => {}}
        />
      )}
    </div>
  );
}
