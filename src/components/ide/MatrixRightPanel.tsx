import { Matrix } from "@/data/mockMatrices";
import { statusLabels } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, Keyboard, Link2, FileText, Cpu } from "lucide-react";
import { useState } from "react";
import { StatusBadge, ruleStatusToVariant } from "@/components/ui/status-badge";
import { CollapsibleSection, PropRow } from "@/components/ui/collapsible-section";

interface MatrixRightPanelProps {
  matrix: Matrix;
}

export function MatrixRightPanel({ matrix }: MatrixRightPanelProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["props", "validation", "deps", "metadata"])
  );

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="w-[300px] min-w-[300px] border-l border-border flex flex-col h-full bg-card overflow-y-auto">
      <CollapsibleSection title="Свойства матрицы" open={openSections.has("props")} onToggle={() => toggleSection("props")}>
        <div className="p-3 space-y-2 text-xs">
          <PropRow label="Название" value={matrix.name} />
          <PropRow label="Тип" value={matrix.matrixType} />
          <PropRow label="Статус">
            <StatusBadge variant={ruleStatusToVariant(matrix.status)}>
              {statusLabels[matrix.status]}
            </StatusBadge>
          </PropRow>
          <PropRow label="Версия" value={`v${matrix.version}`} />
          <PropRow label="Автор" value={matrix.author} />
          <PropRow label="Проверка" value={matrix.lastCheck} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Описание" open={openSections.has("desc")} onToggle={() => toggleSection("desc")}>
        <div className="p-3 text-xs text-foreground leading-relaxed">
          {matrix.description}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Консоль проверки" open={openSections.has("validation")} onToggle={() => toggleSection("validation")}>
        <div className="p-3 space-y-1 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-success">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Структура корректна
          </div>
          {matrix.warningCount > 0 && (
            <div className="flex items-center gap-1.5 text-warning">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              {matrix.warningCount} предупреждений
            </div>
          )}
          {matrix.errorCount > 0 && (
            <div className="flex items-center gap-1.5 text-destructive">
              <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
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
      </CollapsibleSection>

      <CollapsibleSection title="Зависимости" open={openSections.has("deps")} onToggle={() => toggleSection("deps")}>
        <div className="p-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Link2 className="w-3 h-3" />
            <span>{matrix.parametersLinked} параметров</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Cpu className="w-3 h-3" />
            <span>{matrix.functionsLinked} функций</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FileText className="w-3 h-3" />
            <span>{matrix.reportsUsed} отчётов</span>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Метаданные" open={openSections.has("metadata")} onToggle={() => toggleSection("metadata")}>
        <div className="p-3 space-y-2 text-xs">
          <PropRow label="Создано" value={matrix.createdAt} />
          <PropRow label="ID" value={matrix.id} mono />
          <PropRow label="Строк" value={String(matrix.rows.length)} />
          <PropRow label="Активов" value={String(matrix.assets.reduce((acc, a) => acc + 1 + (a.children?.length || 0), 0))} />
        </div>
      </CollapsibleSection>

      <div className="mt-auto p-2.5 border-t border-border">
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <Keyboard className="w-2.5 h-2.5" />
          <span>⌘Enter проверить · ⌘⇧S активировать · ESC закрыть</span>
        </div>
      </div>
    </div>
  );
}
