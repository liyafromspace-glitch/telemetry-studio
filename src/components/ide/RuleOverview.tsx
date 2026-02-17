import { Rule, statusLabels } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, FileText, Link2, GitBranch } from "lucide-react";

interface RuleOverviewProps {
  rule: Rule;
}

export function RuleOverview({ rule }: RuleOverviewProps) {
  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Status card */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          label="Статус"
          value={statusLabels[rule.status]}
          icon={<span className={`status-dot ${
            rule.status === "active" ? "status-active" :
            rule.status === "error" ? "status-error" :
            rule.status === "draft" ? "status-draft" : "status-scheduled"
          }`} />}
        />
        <StatCard label="Версия" value={`v${rule.version}`} icon={<GitBranch className="w-3.5 h-3.5 text-primary" />} />
        <StatCard label="Отчёты" value={String(rule.reportsUsed)} icon={<FileText className="w-3.5 h-3.5 text-primary" />} />
        <StatCard label="Параметры" value={String(rule.parametersLinked)} icon={<Link2 className="w-3.5 h-3.5 text-primary" />} />
        <StatCard
          label="Проблемы"
          value={`${rule.errorCount} / ${rule.warningCount}`}
          icon={
            rule.errorCount > 0
              ? <XCircle className="w-3.5 h-3.5 text-destructive" />
              : rule.warningCount > 0
                ? <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                : <CheckCircle className="w-3.5 h-3.5 text-success" />
          }
        />
      </div>

      {/* Properties */}
      <div className="ide-panel rounded-sm">
        <div className="ide-header">Основные свойства</div>
        <div className="p-3 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          <Property label="Название правила" value={rule.name} />
          <Property label="Тип параметра" value={rule.parameterType} />
          <Property label="Автор" value={rule.author} />
          <Property label="Последняя проверка" value={rule.lastCheck} />
          <Property label="Создано" value={rule.createdAt} />
          <Property label="ID" value={rule.id} mono />
        </div>
      </div>

      {/* Code preview */}
      <div className="ide-panel rounded-sm">
        <div className="ide-header">Функция преобразования</div>
        <pre className="p-3 text-xs font-mono text-foreground overflow-x-auto leading-relaxed">
          <code>{rule.code}</code>
        </pre>
      </div>

      {/* Validation console */}
      <div className="ide-panel rounded-sm">
        <div className="ide-header">Консоль проверки</div>
        <div className="p-3 space-y-1 text-xs font-mono">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="w-3 h-3" />
            Проверка синтаксиса успешна
          </div>
          {rule.warningCount > 0 && (
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-3 h-3" />
              {rule.warningCount} предупреждений
            </div>
          )}
          {rule.errorCount > 0 && (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="w-3 h-3" />
              {rule.errorCount} ошибок диапазона
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="ide-panel rounded-sm p-2.5">
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
        {icon}
        {label}
      </div>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function Property({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</div>
      <div className={`text-foreground ${mono ? "font-mono text-[11px]" : ""}`}>{value}</div>
    </div>
  );
}
