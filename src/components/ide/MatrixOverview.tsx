import { Matrix } from "@/data/mockMatrices";
import { statusLabels } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, FileText, Link2, GitBranch, Cpu } from "lucide-react";

interface MatrixOverviewProps {
  matrix: Matrix;
}

export function MatrixOverview({ matrix }: MatrixOverviewProps) {
  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 stagger-children">
        <StatCard
          label="Статус"
          value={statusLabels[matrix.status]}
          icon={<span className={`status-dot ${
            matrix.status === "active" ? "status-active" :
            matrix.status === "error" ? "status-error" :
            matrix.status === "draft" ? "status-draft" : "status-scheduled"
          }`} />}
        />
        <StatCard label="Версия" value={`v${matrix.version}`} icon={<GitBranch className="w-3.5 h-3.5 text-primary" />} />
        <StatCard label="Отчёты" value={String(matrix.reportsUsed)} icon={<FileText className="w-3.5 h-3.5 text-primary" />} />
        <StatCard label="Параметры" value={String(matrix.parametersLinked)} icon={<Link2 className="w-3.5 h-3.5 text-primary" />} />
        <StatCard label="Функции" value={String(matrix.functionsLinked)} icon={<Cpu className="w-3.5 h-3.5 text-primary" />} />
        <StatCard
          label="Проблемы"
          value={`${matrix.errorCount} / ${matrix.warningCount}`}
          icon={
            matrix.errorCount > 0
              ? <XCircle className="w-3.5 h-3.5 text-destructive" />
              : matrix.warningCount > 0
                ? <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                : <CheckCircle className="w-3.5 h-3.5 text-success" />
          }
        />
      </div>

      {/* Properties */}
      <div className="ide-panel rounded-sm">
        <div className="ide-header">Основные свойства</div>
        <div className="p-3 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          <Property label="Название матрицы" value={matrix.name} />
          <Property label="Тип матрицы" value={matrix.matrixType} />
          <Property label="Автор" value={matrix.author} />
          <Property label="Последняя проверка" value={matrix.lastCheck} />
          <Property label="Создано" value={matrix.createdAt} />
          <Property label="ID" value={matrix.id} mono />
        </div>
      </div>

      {/* Description */}
      <div className="ide-panel rounded-sm">
        <div className="ide-header">Описание</div>
        <div className="p-3 text-xs text-foreground leading-relaxed">
          {matrix.description}
        </div>
      </div>

      {/* Validation console */}
      <div className="ide-panel rounded-sm">
        <div className="ide-header">Консоль проверки</div>
        <div className="p-3 space-y-1 text-xs font-mono">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="w-3 h-3" />
            Структурная проверка успешна
          </div>
          {matrix.warningCount > 0 && (
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-3 h-3" />
              {matrix.warningCount} предупреждений
            </div>
          )}
          {matrix.errorCount > 0 && (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="w-3 h-3" />
              {matrix.errorCount} критических ошибок
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
