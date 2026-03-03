import { useState } from "react";
import { incidents, incidentStatusLabels, type Incident, type IncidentStatus } from "@/data/mockPlatform";
import {
  AlertTriangle, XCircle, CheckCircle, Clock, User, FileText, Link2, ArrowRight,
  ChevronRight, Cpu, Grid3X3
} from "lucide-react";
import { CausalChain, buildIncidentChain } from "@/components/ide/CausalChain";

interface InvestigateViewProps {
  onNavigateToConfigure: () => void;
  initialSignal?: string | null;
}

export function InvestigateView({ onNavigateToConfigure, initialSignal }: InvestigateViewProps) {
  const findIncidentBySignal = (signal: string | null | undefined) => {
    if (!signal) return incidents[0].id;
    const match = incidents.find(i => i.linkedParameters.some(p => p.includes(signal.split(".")[0])));
    return match?.id || incidents[0].id;
  };

  const [selectedId, setSelectedId] = useState<string>(findIncidentBySignal(initialSignal));
  const selected = incidents.find((i) => i.id === selectedId) || incidents[0];

  const priorityColor = (p: string) =>
    p === "critical" ? "text-destructive" : p === "high" ? "text-warning" : "text-muted-foreground";

  const statusIcon = (s: IncidentStatus) => {
    if (s === "resolved") return <CheckCircle className="w-3 h-3 text-success" />;
    if (s === "in_progress") return <Clock className="w-3 h-3 text-primary" />;
    if (s === "monitoring") return <AlertTriangle className="w-3 h-3 text-warning" />;
    return <XCircle className="w-3 h-3 text-destructive" />;
  };

  return (
    <div className="flex-1 flex min-h-0">
      <div className="w-[280px] min-w-[280px] border-r border-border flex flex-col bg-card">
        <div className="ide-header">Инциденты</div>
        {initialSignal && (
          <div className="px-3 py-1.5 bg-primary/10 border-b border-border text-[10px] text-primary">
            Фильтр: {initialSignal}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {incidents.map((inc) => (
            <button
              key={inc.id}
              onClick={() => setSelectedId(inc.id)}
              className={`w-full text-left px-3 py-2 border-b border-border transition-colors ${
                selectedId === inc.id ? "bg-accent" : "hover:bg-accent/30"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs">
                {statusIcon(inc.status)}
                <span className="font-mono text-[10px] text-muted-foreground">{inc.code}</span>
                <span className={`ml-auto text-[9px] uppercase tracking-wider ${priorityColor(inc.priority)}`}>
                  {inc.priority}
                </span>
              </div>
              <div className="text-xs text-foreground mt-0.5 truncate">{inc.title}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {incidentStatusLabels[inc.status]} · {inc.updatedAt}
              </div>
            </button>
          ))}
        </div>
      </div>

      <IncidentDetail incident={selected} onNavigateToConfigure={onNavigateToConfigure} />
    </div>
  );
}

function IncidentDetail({ incident, onNavigateToConfigure }: { incident: Incident; onNavigateToConfigure: () => void }) {
  const [activeTab, setActiveTab] = useState<"description" | "tasks" | "history" | "linked">("description");

  const tabs = [
    { id: "description" as const, label: "Описание" },
    { id: "tasks" as const, label: "Задачи" },
    { id: "history" as const, label: "История" },
    { id: "linked" as const, label: "Связанные конфигурации" },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Инциденты</span>
          <ChevronRight className="w-3 h-3" />
          <span className="font-mono">{incident.code}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{incident.title}</span>
        </div>
        <button onClick={onNavigateToConfigure} className="btn-primary">
          Открыть в CONFIGURE <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-center gap-4 px-4 py-1.5 border-b border-border bg-card text-[10px]">
        <span className="flex items-center gap-1 text-muted-foreground">
          Статус: <span className="text-foreground">{incidentStatusLabels[incident.status]}</span>
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          Приоритет: <span className={incident.priority === "critical" ? "text-destructive" : "text-warning"}>{incident.priority}</span>
        </span>
        {incident.assignee && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <User className="w-2.5 h-2.5" /> {incident.assignee}
          </span>
        )}
      </div>

      <div className="flex border-b border-border bg-card">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium transition-colors relative ${
              activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-background p-4">
        {activeTab === "description" && (
          <div className="space-y-3 animate-fade-in">
            <div className="ide-panel-glow rounded-sm">
              <div className="ide-header">Описание</div>
              <div className="p-3 text-xs text-foreground leading-relaxed">{incident.description}</div>
            </div>
            <CausalChain
              title="Почему произошёл инцидент"
              steps={buildIncidentChain(incident)}
            />
            <div className="ide-panel-glow rounded-sm">
              <div className="ide-header">Связанные параметры</div>
              <div className="p-3 flex flex-wrap gap-1.5">
                {incident.linkedParameters.map((p) => (
                  <span key={p} className="px-2 py-0.5 bg-accent rounded-sm text-[10px] font-mono text-foreground border border-border">{p}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="ide-panel-glow rounded-sm animate-fade-in">
            <div className="ide-header">Задачи</div>
            <div className="divide-y divide-border">
              {incident.tasks.length === 0 ? (
                <div className="p-3 text-xs text-muted-foreground">Нет задач</div>
              ) : (
                incident.tasks.map((task) => (
                  <div key={task.id} className="px-3 py-2 flex items-center gap-2 text-xs">
                    <span className={`w-3 h-3 rounded-sm border flex items-center justify-center text-[8px] ${
                      task.done ? "bg-success/20 border-success text-success" : "border-muted-foreground"
                    }`}>
                      {task.done && "✓"}
                    </span>
                    <span className={`flex-1 ${task.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {task.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <User className="w-2.5 h-2.5" /> {task.assignee}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="ide-panel-glow rounded-sm animate-fade-in">
            <div className="ide-header">История</div>
            <div className="divide-y divide-border">
              {incident.history.map((entry, i) => (
                <div key={i} className="px-3 py-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono text-[10px]">{entry.date}</span>
                    <span className="flex items-center gap-1 ml-auto">
                      <User className="w-2.5 h-2.5" /> {entry.user}
                    </span>
                  </div>
                  <div className="text-foreground mt-0.5 pl-5">{entry.action}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "linked" && (
          <div className="space-y-3 animate-fade-in">
            <div className="ide-panel-glow rounded-sm">
              <div className="ide-header flex items-center gap-1.5">
                <Cpu className="w-3 h-3" /> Функции
              </div>
              <div className="p-3 space-y-1">
                {incident.linkedFunctions.map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-xs text-foreground">
                    <FileText className="w-3 h-3 text-muted-foreground" /> {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="ide-panel-glow rounded-sm">
              <div className="ide-header flex items-center gap-1.5">
                <Grid3X3 className="w-3 h-3" /> Матрицы
              </div>
              <div className="p-3 space-y-1">
                {incident.linkedMatrices.map((m) => (
                  <div key={m} className="flex items-center gap-1.5 text-xs text-foreground">
                    <Link2 className="w-3 h-3 text-muted-foreground" /> {m}
                  </div>
                ))}
              </div>
            </div>
            <div className="ide-panel-glow rounded-sm">
              <div className="ide-header flex items-center gap-1.5">
                <FileText className="w-3 h-3" /> Отчёты
              </div>
              <div className="p-3 space-y-1">
                {incident.linkedReports.map((r) => (
                  <div key={r} className="flex items-center gap-1.5 text-xs text-foreground">
                    <FileText className="w-3 h-3 text-muted-foreground" /> {r}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
