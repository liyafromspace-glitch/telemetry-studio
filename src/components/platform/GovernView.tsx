import { versionAuditLog, type VersionAuditEntry } from "@/data/mockPlatform";
import {
  Shield, GitBranch, Clock, User, FileText, Link2, Cpu, ArrowRight, Grid3X3
} from "lucide-react";

interface GovernViewProps {
  onNavigateToAnalyze: () => void;
}

export function GovernView({ onNavigateToAnalyze }: GovernViewProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-2 text-xs">
          <Shield className="w-3.5 h-3.5 text-[hsl(270,60%,65%)]" />
          <span className="font-medium text-foreground">Журнал управления и аудита</span>
        </div>
        <button
          onClick={onNavigateToAnalyze}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground bg-secondary rounded-sm transition-colors"
        >
          Перейти к отчётам <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card">
        <button className="px-4 py-2 text-xs text-foreground relative">
          Журнал активаций
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
        </button>
        <button className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground">
          Сравнение версий
        </button>
      </div>

      {/* Audit log */}
      <div className="flex-1 overflow-y-auto bg-background p-4 space-y-3 animate-fade-in">
        {versionAuditLog.map((entry) => (
          <AuditCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function AuditCard({ entry }: { entry: VersionAuditEntry }) {
  return (
    <div className="ide-panel rounded-sm">
      <div className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-foreground">{entry.entityName}</span>
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-accent text-muted-foreground">
                {entry.entityType === "function" ? "Функция" : "Матрица"}
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-primary flex-shrink-0">
            v{entry.fromVersion} → v{entry.toVersion}
          </span>
        </div>

        {/* Change */}
        <div className="text-xs text-foreground bg-background rounded-sm p-2 border border-border font-mono">
          {entry.changeDescription}
        </div>

        {/* Impact */}
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

        {/* Meta */}
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1 border-t border-border">
          <span className="flex items-center gap-1">
            <User className="w-2.5 h-2.5" /> {entry.activatedBy}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> {entry.activatedAt}
          </span>
        </div>
      </div>
    </div>
  );
}
