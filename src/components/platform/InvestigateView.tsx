import { useState } from "react";
import { incidents, incidentStatusLabels, type Incident, type IncidentStatus } from "@/data/mockPlatform";
import {
  AlertTriangle, XCircle, CheckCircle, Clock, User, FileText, Link2, ArrowRight,
  ChevronRight, Cpu, Grid3X3
} from "lucide-react";
import { CausalChain, buildIncidentChain } from "@/components/ide/CausalChain";
import { SystemStory } from "@/components/ide/SystemStory";
import { IncidentPlayback } from "@/components/ide/IncidentPlayback";
import { StatusBadge, ruleStatusToVariant } from "@/components/ui/status-badge";
import { TimelineList, type TimelineItem } from "@/components/ui/timeline-list";

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

  return (
    <div className="flex-1 flex min-h-0">
      <div className="w-[280px] min-w-[280px] border-r border-border flex flex-col bg-card">
        <div className="ide-header">Инциденты</div>
        {initialSignal && (
          <div className="px-4 py-2 bg-primary/8 border-b border-border text-[11px] text-primary font-medium">
            Фильтр: {initialSignal}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {incidents.map((inc) => (
            <button
              key={inc.id}
              onClick={() => setSelectedId(inc.id)}
              className={`w-full text-left px-4 py-3 border-b border-border transition-colors duration-150 ${
                selectedId === inc.id ? "bg-accent" : "hover:bg-accent/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] text-muted-foreground">{inc.code}</span>
                <StatusBadge variant={ruleStatusToVariant(inc.status)} size="xs">
                  {incidentStatusLabels[inc.status]}
                </StatusBadge>
              </div>
              <div className="text-xs text-foreground truncate mb-1.5">{inc.title}</div>
              <div className="flex items-center gap-2">
                <StatusBadge
                  variant={inc.priority === "critical" ? "error" : inc.priority === "high" ? "warning" : "idle"}
                  size="xs"
                >
                  {inc.priority}
                </StatusBadge>
                <span className="text-[10px] text-muted-foreground ml-auto">{inc.updatedAt}</span>
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
  const [activeTab, setActiveTab] = useState<"description" | "story" | "tasks" | "history" | "linked">("description");

  const tabs = [
    { id: "description" as const, label: "Описание" },
    { id: "story" as const, label: "Хронология" },
    { id: "tasks" as const, label: "Задачи" },
    { id: "history" as const, label: "История" },
    { id: "linked" as const, label: "Связанные" },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-card">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
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

      <div className="flex items-center gap-4 px-5 py-2 border-b border-border bg-card text-[11px]">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          Статус:
          <StatusBadge variant={ruleStatusToVariant(incident.status)} size="xs">
            {incidentStatusLabels[incident.status]}
          </StatusBadge>
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          Приоритет:
          <StatusBadge
            variant={incident.priority === "critical" ? "error" : incident.priority === "high" ? "warning" : "idle"}
            size="xs"
          >
            {incident.priority}
          </StatusBadge>
        </span>
        {incident.assignee && (
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <User className="w-3 h-3" /> {incident.assignee}
          </span>
        )}
      </div>

      <div className="flex gap-1 p-1.5 border-b border-border bg-card">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150 ${
              activeTab === tab.id ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-background p-5">
        {activeTab === "description" && (
          <div className="space-y-4 animate-fade-in">
            <div className="vercel-card">
              <div className="ide-header">Описание</div>
              <div className="p-4 text-xs text-foreground leading-relaxed">{incident.description}</div>
            </div>

            <IncidentPlayback incident={incident} />

            <CausalChain
              title="Почему произошёл инцидент"
              steps={buildIncidentChain(incident)}
            />
            <div className="vercel-card">
              <div className="ide-header">Связанные параметры</div>
              <div className="p-4 flex flex-wrap gap-2">
                {incident.linkedParameters.map((p) => (
                  <StatusBadge key={p} variant="neutral" size="xs" dot={false} className="font-mono">
                    {p}
                  </StatusBadge>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "story" && (
          <div className="animate-fade-in">
            <SystemStory incident={incident} />
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="vercel-card animate-fade-in">
            <div className="ide-header">Задачи</div>
            <div className="divide-y divide-border">
              {incident.tasks.length === 0 ? (
                <div className="p-4 text-xs text-muted-foreground">Нет задач</div>
              ) : (
                incident.tasks.map((task) => (
                  <div key={task.id} className="px-4 py-3 flex items-center gap-3 text-xs">
                    <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[9px] ${
                      task.done ? "bg-success/15 border-success/30 text-success" : "border-muted-foreground/30"
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
          <div className="animate-fade-in">
            <TimelineList
              title="История"
              headerIcon={<Clock className="w-3 h-3" />}
              items={incident.history.map((entry, i): TimelineItem => ({
                id: `hist-${i}`,
                label: entry.date,
                title: entry.action,
                dotColor: "muted-foreground",
                meta: (
                  <span className="flex items-center gap-1">
                    <User className="w-2.5 h-2.5" /> {entry.user}
                  </span>
                ),
              }))}
              expandable={false}
            />
          </div>
        )}

        {activeTab === "linked" && (
          <div className="space-y-4 animate-fade-in">
            <div className="vercel-card">
              <div className="ide-header flex items-center gap-1.5">
                <Cpu className="w-3 h-3" /> Функции
              </div>
              <div className="p-4 space-y-2">
                {incident.linkedFunctions.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-foreground">
                    <FileText className="w-3 h-3 text-muted-foreground" /> {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="vercel-card">
              <div className="ide-header flex items-center gap-1.5">
                <Grid3X3 className="w-3 h-3" /> Матрицы
              </div>
              <div className="p-4 space-y-2">
                {incident.linkedMatrices.map((m) => (
                  <div key={m} className="flex items-center gap-2 text-xs text-foreground">
                    <Link2 className="w-3 h-3 text-muted-foreground" /> {m}
                  </div>
                ))}
              </div>
            </div>
            <div className="vercel-card">
              <div className="ide-header flex items-center gap-1.5">
                <FileText className="w-3 h-3" /> Отчёты
              </div>
              <div className="p-4 space-y-2">
                {incident.linkedReports.map((r) => (
                  <div key={r} className="flex items-center gap-2 text-xs text-foreground">
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
