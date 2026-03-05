import { useState } from "react";
import { versionAuditLog, type VersionAuditEntry } from "@/data/mockPlatform";
import {
  Shield, GitBranch, Clock, User, FileText, Link2, Cpu, ArrowRight, ChevronDown
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
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-2 text-xs">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span className="font-medium text-foreground">Журнал управления и аудита</span>
        </div>
        <button onClick={onNavigateToAnalyze} className="btn-secondary">
          Перейти к отчётам <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex gap-0.5 p-1 border-b border-border bg-card text-[11px]">
        <button
          onClick={() => setActiveTab("log")}
          className={`flex-1 py-1 px-3 text-center font-medium rounded-md transition-colors duration-150 ${
            activeTab === "log"
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Журнал активаций
        </button>
        <button
          onClick={() => setActiveTab("compare")}
          className={`flex-1 py-1 px-3 text-center font-medium rounded-md transition-colors duration-150 ${
            activeTab === "compare"
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground"
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
        <div className="flex-1 overflow-auto p-4 animate-fade-in">
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
            {entry.entityType === "function" ? "Функция" : "Матрица"}
          </StatusBadge>
        </td>
        <td className="px-4 py-2 text-center">
          <span className={`font-mono ${totalImpact > 100 ? "text-warning" : "text-muted-foreground"}`}>
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
      {expanded && (
        <tr className="bg-accent/10">
          <td colSpan={7} className="px-4 py-3">
            <div className="space-y-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Изменение:</div>
              <div className="vercel-card p-2 text-xs font-mono text-foreground">
                {entry.changeDescription}
              </div>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Link2 className="w-2.5 h-2.5" /> {entry.impactParameters} параметров
                </span>
                <span className="flex items-center gap-1">
                  <Cpu className="w-2.5 h-2.5" /> {entry.impactFunctions} функций
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-2.5 h-2.5" /> {entry.impactReports} отчётов
                </span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function VersionCompare() {
  return (
    <div className="space-y-4">
      <div className="vercel-card">
        <div className="ide-header">Сравнение: Матрица диапазонов давления v3 → v4</div>
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-semibold">v3 (предыдущая)</div>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-muted-foreground">Участок Б → Манометр #2</div>
              <div className="text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-sm border border-destructive/20">Допустимое отклонение: <strong>200</strong> бар</div>
              <div className="text-muted-foreground mt-2">Участок В → Манометр #3</div>
              <div className="text-muted-foreground px-1.5 py-0.5">Диапазон: 0–350 бар</div>
            </div>
          </div>
          <div className="p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-semibold">v4 (текущая)</div>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-muted-foreground">Участок Б → Манометр #2</div>
              <div className="text-success bg-success/10 px-1.5 py-0.5 rounded-sm border border-success/20">Допустимое отклонение: <strong>250</strong> бар</div>
              <div className="text-muted-foreground mt-2">Участок В → Манометр #3</div>
              <div className="text-success bg-success/10 px-1.5 py-0.5 rounded-sm border border-success/20">Диапазон: 0–400 бар <span className="text-[9px]">(добавлено)</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="vercel-card">
        <div className="ide-header">Сравнение: Конвертация температуры v4 → v5</div>
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-semibold">v4</div>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-muted-foreground">Поддерживаемые единицы:</div>
              <div className="text-muted-foreground px-1.5 py-0.5">°C, °F</div>
            </div>
          </div>
          <div className="p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-semibold">v5</div>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-muted-foreground">Поддерживаемые единицы:</div>
              <div className="text-success bg-success/10 px-1.5 py-0.5 rounded-sm border border-success/20">°C, °F, <strong>K</strong> <span className="text-[9px]">(добавлено)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
