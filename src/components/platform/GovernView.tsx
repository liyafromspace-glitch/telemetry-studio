import { useState } from "react";
import { versionAuditLog, type VersionAuditEntry } from "@/data/mockPlatform";
import {
  GitBranch, Clock, User, FileText, Link2, Cpu, ArrowRight, ChevronDown } from
"lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

interface GovernViewProps {
  onNavigateToAnalyze: () => void;
}

export function GovernView({ onNavigateToAnalyze }: GovernViewProps) {
  const [activeTab, setActiveTab] = useState<"log" | "compare">("log");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-2 text-xs">
        </div>
        <button onClick={onNavigateToAnalyze} className="btn-secondary">
          Перейти к отчётам <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex gap-0.5 p-1 border-b border-border bg-card text-[11px]">
        <button
          onClick={() => setActiveTab("log")}
          className={`flex-1 py-1 px-3 text-center font-medium rounded-md transition-colors duration-150 ${
          activeTab === "log" ?
          "bg-accent text-foreground" :
          "text-muted-foreground hover:text-foreground"}`
          }>
          Журнал активаций
        </button>
        <button
          onClick={() => setActiveTab("compare")}
          className={`flex-1 py-1 px-3 text-center font-medium rounded-md transition-colors duration-150 ${
          activeTab === "compare" ?
          "bg-accent text-foreground" :
          "text-muted-foreground hover:text-foreground"}`
          }>
          Сравнение версий
        </button>
      </div>

      {activeTab === "log" ?
      <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider bg-card">
                <th className="text-left px-4 py-2 font-medium w-6"></th>
                <th className="text-left px-4 py-2 font-medium">Пользователь</th>
                <th className="text-left px-4 py-2 font-medium">Изменение</th>
                <th className="text-left px-4 py-2 font-medium">Тип</th>
                <th className="text-center px-4 py-2 font-medium">Влияние</th>
                <th className="text-left px-4 py-2 font-medium">Версия</th>
                <th className="text-left px-4 py-2 font-medium">Время</th>
              </tr>
            </thead>
            <tbody>
              {versionAuditLog.map((entry) =>
            <AuditRow
              key={entry.id}
              entry={entry}
              expanded={expandedRow === entry.id}
              onToggle={() => setExpandedRow(expandedRow === entry.id ? null : entry.id)} />
            )}
            </tbody>
          </table>
        </div> :

      <div className="flex-1 overflow-auto p-4 animate-fade-in">
          <VersionCompare />
        </div>
      }
    </div>);
}

function AuditRow({ entry, expanded, onToggle }: {entry: VersionAuditEntry;expanded: boolean;onToggle: () => void;}) {
  const totalImpact = entry.impactParameters + entry.impactFunctions + entry.impactReports;

  return (
    <>
      <tr
        className="border-b border-border hover:bg-accent/30 transition-colors cursor-pointer"
        onClick={onToggle}>
        <td className="px-4 py-2">
          <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${expanded ? "" : "-rotate-90"}`} />
        </td>
        <td className="px-4 py-2">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3 text-muted-foreground" />
            <span className="text-foreground">{entry.activatedBy}</span>
          </span>
        </td>
        <td className="px-4 py-2 text-foreground max-w-[300px] truncate">{entry.entityName}</td>
        <td className="px-4 py-2">
          <StatusBadge variant="neutral" size="xs" dot={false}>
            {entry.entityType === "function" ? "Правило" : "Матрица"}
          </StatusBadge>
        </td>
        <td className="px-4 py-2 text-center">
          <span className={`font-mono ${totalImpact > 10 ? "text-warning" : "text-muted-foreground"}`}>
            {totalImpact} объектов
          </span>
        </td>
        <td className="px-4 py-2 font-mono text-primary">v{entry.fromVersion} → v{entry.toVersion}</td>
        <td className="px-4 py-2 text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {entry.activatedAt}
          </span>
        </td>
      </tr>
      {expanded &&
      <tr className="bg-accent/10">
          <td colSpan={7} className="px-4 py-3">
            <div className="space-y-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Изменение:</div>
              <div className="ide-panel-glow rounded-sm p-2 text-xs font-mono text-foreground">
                {entry.changeDescription}
              </div>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Link2 className="w-2.5 h-2.5" /> {entry.impactParameters} сигналов
                </span>
                <span className="flex items-center gap-1">
                  <Cpu className="w-2.5 h-2.5" /> {entry.impactFunctions} правил
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-2.5 h-2.5" /> {entry.impactReports} отчётов
                </span>
              </div>

              {/* Risk Analysis for the overheating rule change */}
              {entry.entityName === "Контроль перегрева" && (
                <div className="mt-2 p-2 rounded-md border border-warning/20 bg-warning/5 text-xs">
                  <div className="text-[10px] text-warning uppercase tracking-wider font-semibold mb-1">Анализ риска</div>
                  <div className="text-foreground space-y-0.5">
                    <div>Затронутые сигналы: <span className="font-mono">12</span></div>
                    <div>Затронутые объекты: <span className="font-mono">3</span></div>
                    <div className="text-muted-foreground mt-1">Повышение порога до 95°C снижает вероятность ложных срабатываний на ~40%.</div>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      }
    </>);
}

function VersionCompare() {
  return (
    <div className="space-y-4">
      <div className="ide-panel-glow rounded-sm">
        <div className="ide-header">Сравнение: Контроль перегрева v2 → v3</div>
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-semibold">v2 (предыдущая)</div>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-muted-foreground">Порог температуры:</div>
              <div className="text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-sm border border-destructive/20">TEMP_THRESHOLD = <strong>90</strong> °C</div>
              <div className="text-muted-foreground mt-2">Условие активации:</div>
              <div className="text-muted-foreground px-1.5 py-0.5">temperature &gt; 90 AND pressure &gt; 11</div>
            </div>
          </div>
          <div className="p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-semibold">v3 (текущая)</div>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-muted-foreground">Порог температуры:</div>
              <div className="text-success bg-success/10 px-1.5 py-0.5 rounded-sm border border-success/20">TEMP_THRESHOLD = <strong>95</strong> °C <span className="text-[9px]">(повышен)</span></div>
              <div className="text-muted-foreground mt-2">Условие активации:</div>
              <div className="text-success bg-success/10 px-1.5 py-0.5 rounded-sm border border-success/20">temperature &gt; 95 AND pressure &gt; 11 <span className="text-[9px]">(обновлено)</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="ide-panel-glow rounded-sm">
        <div className="ide-header">Сравнение: Контроль давления линии v4 → v5</div>
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-semibold">v4</div>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-muted-foreground">Верхний порог:</div>
              <div className="text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-sm border border-destructive/20">MAX_PRESSURE = <strong>11</strong> бар</div>
            </div>
          </div>
          <div className="p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-semibold">v5</div>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-muted-foreground">Верхний порог:</div>
              <div className="text-success bg-success/10 px-1.5 py-0.5 rounded-sm border border-success/20">MAX_PRESSURE = <strong>12</strong> бар <span className="text-[9px]">(повышен)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
