import { Matrix } from "@/data/mockMatrices";
import { statusLabels } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, Keyboard } from "lucide-react";

interface MatrixRightPanelProps {
  matrix: Matrix;
}

export function MatrixRightPanel({ matrix }: MatrixRightPanelProps) {
  return (
    <div className="w-[300px] min-w-[300px] border-l border-border flex flex-col h-full bg-card">
      <div className="panel-section">
        <div className="ide-header">Свойства матрицы</div>
        <div className="p-3 space-y-2 text-xs">
          <PropRow label="Название" value={matrix.name} />
          <PropRow label="Тип" value={matrix.matrixType} />
          <PropRow label="Статус" value={statusLabels[matrix.status]} badge={matrix.status} />
          <PropRow label="Версия" value={`v${matrix.version}`} />
          <PropRow label="Автор" value={matrix.author} />
          <PropRow label="Проверка" value={matrix.lastCheck} />
        </div>
      </div>

      <div className="panel-section">
        <div className="ide-header">Описание</div>
        <div className="p-3 text-xs text-foreground leading-relaxed">
          {matrix.description}
        </div>
      </div>

      <div className="panel-section">
        <div className="ide-header">Статистика</div>
        <div className="p-3 space-y-2 text-xs">
          <PropRow label="Строк" value={String(matrix.rows.length)} />
          <PropRow label="Активов" value={String(matrix.assets.reduce((acc, a) => acc + 1 + (a.children?.length || 0), 0))} />
          <PropRow label="Параметров" value={String(matrix.parametersLinked)} />
          <PropRow label="Функций" value={String(matrix.functionsLinked)} />
          <PropRow label="Отчётов" value={String(matrix.reportsUsed)} />
        </div>
      </div>

      <div className="panel-section">
        <div className="ide-header">Консоль проверки</div>
        <div className="p-2 space-y-0.5 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-success">
            <CheckCircle className="w-3 h-3 flex-shrink-0" />
            Структура OK
          </div>
          {matrix.warningCount > 0 && (
            <div className="flex items-center gap-1.5 text-warning">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              {matrix.warningCount} предупр.
            </div>
          )}
          {matrix.errorCount > 0 && (
            <div className="flex items-center gap-1.5 text-destructive">
              <XCircle className="w-3 h-3 flex-shrink-0" />
              {matrix.errorCount} ошибок
            </div>
          )}
          {matrix.rows.filter(r => r.statusMessage).map((row) => (
            <div
              key={row.id}
              className={`flex items-start gap-1.5 pl-4 ${row.status === "error" ? "text-destructive" : "text-warning"}`}
            >
              <span className="text-[10px]">└</span>
              <span className="text-[10px]">{row.source}: {row.statusMessage}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto p-2.5 border-t border-border">
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <Keyboard className="w-2.5 h-2.5" />
          <span>⌘Enter проверить · ⌘⇧S активировать · ESC закрыть</span>
        </div>
      </div>
    </div>
  );
}

function PropRow({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground flex items-center gap-1.5 font-medium">
        {badge && (
          <span
            className={`status-dot ${
              badge === "active" ? "status-active" :
              badge === "error" ? "status-error" :
              badge === "draft" ? "status-draft" : "status-scheduled"
            }`}
          />
        )}
        {value}
      </span>
    </div>
  );
}
