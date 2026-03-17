import { useState } from "react";
import { versionAuditLog, type VersionAuditEntry } from "@/data/mockPlatform";
import {
  Clock, User, FileText, Link2, Cpu, ArrowRight, ChevronDown
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

interface GovernViewProps {
  onNavigateToAnalyze: () => void;
}

export function GovernView({ onNavigateToAnalyze }: GovernViewProps) {
  const [activeTab, setActiveTab] = useState<"log" | "compare">("log");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-card">
        <div className="flex items-center gap-2 text-xs" />
        <button onClick={onNavigateToAnalyze} className="btn-secondary">
          Перейти к отчётам <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex gap-1 p-1.5 border-b border-border bg-card text-[11px]">
        <button
          onClick={() => setActiveTab("log")}
          className={`flex-1 py-1.5 px-3 text-center font-medium rounded-lg transition-colors duration-150 ${
            activeTab === "log" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Журнал активаций
        </button>
        <button
          onClick={() => setActiveTab("compare")}
          className={`flex-1 py-1.5 px-3 text-center font-medium rounded-lg transition-colors duration-150 ${
            activeTab === "compare" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Сравнение версий
        </button>
      </div>

      {activeTab === "log" ? (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider bg-card">
                <th className="text-left px-5 py-3 font-medium w-6"></th>
                <th className="text-left px-5 py-3 font-medium">Пользователь</th>
                <th className="text-left px-5 py-3 font-medium">Изменение</th>
                <th className="text-left px-5 py-3 font-medium">Тип</th>
                <th className="text-center px-5 py-3 font-medium">Влияние</th>
                <th className="text-left px-5 py-3 font-medium">Версия</th>
                <th className="text-left px-5 py-3 font-medium">Время</th>
              </tr>
            </thead>
            <tbody>
              {versionAuditLog.map((entry) => (
                <AuditRow
                  key={entry.id}
                  entry={entry}
                  expanded={expandedRow === entry.id}
                  onToggle={() => setExpandedRow(expandedRow === entry.id ? null : entry.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-5 animate-fade-in">
          <VersionCompare />
        </div>
      )}
    </div>
  );
}

function AuditRow({ entry, expanded, onToggle }: { entry: VersionAuditEntry; expanded: boolean; onToggle: () => void }) {
  const totalImpact = entry.impactParameters + entry.impactFunctions + entry.impactReports;

  return (
    <>
      <tr
        className="border-b border-border hover:bg-accent/30 transition-colors cursor-pointer"
        onClick={onToggle}
      >
        <td className="px-5 py-3">
          <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${expanded ? "" : "-rotate-90"}`} />
        </td>
        <td className="px-5 py-3">
          <span className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-muted-foreground" />
            <span className="text-foreground">{entry.activatedBy}</span>
          </span>
        </td>
        <td className="px-5 py-3 text-foreground max-w-[300px] truncate">{entry.entityName}</td>
        <td className="px-5 py-3">
          <StatusBadge variant="neutral" size="xs" dot={false}>
            {entry.entityType === "function" ? "Правило" : "Матрица"}
          </StatusBadge>
        </td>
        <td className="px-5 py-3 text-center">
          <span className={`font-mono ${totalImpact > 10 ? "text-warning" : "text-muted-foreground"}`}>
            {totalImpact} объектов
          </span>
        </td>
        <td className="px-5 py-3 font-mono text-primary">v{entry.fromVersion} → v{entry.toVersion}</td>
        <td className="px-5 py-3 text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {entry.activatedAt}
          </span>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-accent/10">
          <td colSpan={7} className="px-5 py-4">
            <div className="space-y-3">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Изменение:</div>
              <div className="vercel-card p-3 text-xs font-mono text-foreground">
                {entry.changeDescription}
              </div>
              <div className="flex items-center gap-5 text-[10px] text-muted-foreground">
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

              {entry.entityName === "Контроль перегрева" && (
                <div className="p-3 rounded-xl border border-warning/15 bg-warning/5 text-xs">
                  <div className="text-[10px] text-warning uppercase tracking-wider font-semibold mb-1.5">Анализ риска</div>
                  <div className="text-foreground space-y-1">
                    <div>Затронутые сигналы: <span className="font-mono">12</span></div>
                    <div>Затронутые объекты: <span className="font-mono">3</span></div>
                    <div className="text-muted-foreground mt-1.5">Повышение порога до 95°C снижает вероятность ложных срабатываний на ~40%.</div>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function VersionCompare() {
  return (
    <div className="space-y-5">
      <div className="vercel-card">
        <div className="ide-header">Сравнение: Контроль перегрева v2 → v3</div>
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="p-4">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2.5 font-semibold">v2 (предыдущая)</div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="text-muted-foreground">Порог температуры:</div>
              <div className="text-destructive bg-destructive/8 px-2 py-1 rounded-lg border border-destructive/15">TEMP_THRESHOLD = <strong>90</strong> °C</div>
              <div className="text-muted-foreground mt-2">Условие активации:</div>
              <div className="text-muted-foreground px-2 py-1">temperature &gt; 90 AND pressure &gt; 11</div>
            </div>
          </div>
          <div className="p-4">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2.5 font-semibold">v3 (текущая)</div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="text-muted-foreground">Порог температуры:</div>
              <div className="text-success bg-success/8 px-2 py-1 rounded-lg border border-success/15">TEMP_THRESHOLD = <strong>95</strong> °C <span className="text-[9px]">(повышен)</span></div>
              <div className="text-muted-foreground mt-2">Условие активации:</div>
              <div className="text-success bg-success/8 px-2 py-1 rounded-lg border border-success/15">temperature &gt; 95 AND pressure &gt; 11 <span className="text-[9px]">(обновлено)</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="vercel-card">
        <div className="ide-header">Сравнение: Контроль давления линии v4 → v5</div>
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="p-4">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2.5 font-semibold">v4</div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="text-muted-foreground">Верхний порог:</div>
              <div className="text-destructive bg-destructive/8 px-2 py-1 rounded-lg border border-destructive/15">MAX_PRESSURE = <strong>11</strong> бар</div>
            </div>
          </div>
          <div className="p-4">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2.5 font-semibold">v5</div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="text-muted-foreground">Верхний порог:</div>
              <div className="text-success bg-success/8 px-2 py-1 rounded-lg border border-success/15">MAX_PRESSURE = <strong>12</strong> бар <span className="text-[9px]">(повышен)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
