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
import { ContextInspector } from "@/components/ide/ContextInspector";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

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
    <ResizablePanelGroup direction="horizontal" className="flex-1">
      {/* Left: incident list */}
      <ResizablePanel defaultSize={22} minSize={15} maxSize={35}>
        <div className="flex flex-col h-full bg-card">
          <div className="ide-header">Incidents</div>
          {initialSignal && (
            <div className="px-4 py-2 bg-primary/8 border-b border-border text-[11px] text-primary font-medium">
              Filter: {initialSignal}
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
      </ResizablePanel>
      <ResizableHandle />
      {/* Center: detail */}
      <ResizablePanel defaultSize={58} minSize={30}>
        <IncidentDetail incident={selected} onNavigateToConfigure={onNavigateToConfigure} />
      </ResizablePanel>
      <ResizableHandle />
      {/* Right: context inspector */}
      <ResizablePanel defaultSize={20} minSize={12} collapsible>
        <ContextInspector />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function IncidentDetail({ incident, onNavigateToConfigure }: { incident: Incident; onNavigateToConfigure: () => void }) {
  const [activeTab, setActiveTab] = useState<"description" | "story" | "tasks" | "history" | "linked">("description");

  const tabs = [
    { id: "description" as const, label: "Inspect" },
    { id: "story" as const, label: "Trace" },
    { id: "tasks" as const, label: "Tasks" },
    { id: "history" as const, label: "Log" },
    { id: "linked" as const, label: "References" },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      <div className="flex items-center justify-between px-5 py-2 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Incidents</span>
          <ChevronRight className="w-3 h-3" />
          <span className="font-mono">{incident.code}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{incident.title}</span>
        </div>
        <button onClick={onNavigateToConfigure} className="btn-primary">
          Open in EDIT <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-center gap-4 px-5 py-2 border-b border-border bg-card text-[11px] shrink-0">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          Status:
          <StatusBadge variant={ruleStatusToVariant(incident.status)} size="xs">
            {incidentStatusLabels[incident.status]}
          </StatusBadge>
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          Priority:
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

      <div className="flex gap-1 p-1.5 border-b border-border bg-card shrink-0">
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

      <div className="flex-1 overflow-y-auto bg-background p-5 min-h-0">
        {activeTab === "description" && (
          <div className="space-y-4">
            <div className="vercel-card">
              <div className="ide-header">Description</div>
              <div className="p-4 text-xs text-foreground leading-relaxed">{incident.description}</div>
            </div>
            <IncidentPlayback incident={incident} />
            <CausalChain title="Root Cause Analysis" steps={buildIncidentChain(incident)} />
            <div className="vercel-card">
              <div className="ide-header">Linked Signals</div>
              <div className="p-4 flex flex-wrap gap-2">
                {incident.linkedParameters.map((p) => (
                  <StatusBadge key={p} variant="neutral" size="xs" dot={false} className="font-mono">{p}</StatusBadge>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "story" && <SystemStory incident={incident} />}

        {activeTab === "tasks" && (
          <div className="vercel-card">
            <div className="ide-header">Tasks</div>
            <div className="divide-y divide-border">
              {incident.tasks.length === 0 ? (
                <div className="p-4 text-xs text-muted-foreground">No tasks</div>
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
          <TimelineList
            title="Execution Log"
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
        )}

        {activeTab === "linked" && (
          <div className="space-y-4">
            <div className="vercel-card">
              <div className="ide-header flex items-center gap-1.5">
                <Cpu className="w-3 h-3" /> Rules
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
                <Grid3X3 className="w-3 h-3" /> Matrices
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
                <FileText className="w-3 h-3" /> Reports
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
