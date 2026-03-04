import { Matrix } from "@/data/mockMatrices";
import { statusLabels } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, Keyboard, ChevronDown, Link2, FileText, Cpu } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

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
      {/* Properties */}
      <CollapsibleSection
        title="Свойства матрицы"
        open={openSections.has("props")}
        onToggle={() => toggleSection("props")}
      >
        <div className="p-3 space-y-2 text-xs">
          <PropRow label="Название" value={matrix.name} />
          <PropRow label="Тип" value={matrix.matrixType} />
          <PropRow label="Статус" value={statusLabels[matrix.status]} badge={matrix.status} />
          <PropRow label="Версия" value={`v${matrix.version}`} />
          <PropRow label="Автор" value={matrix.author} />
          <PropRow label="Проверка" value={matrix.lastCheck} />
        </div>
      </CollapsibleSection>

      {/* Description */}
      <CollapsibleSection
        title="Описание"
        open={openSections.has("desc")}
        onToggle={() => toggleSection("desc")}
      >
        <div className="p-3 text-xs text-foreground leading-relaxed">
          {matrix.description}
        </div>
      </CollapsibleSection>

      {/* Validation Console */}
      <CollapsibleSection
        title="Консоль проверки"
        open={openSections.has("validation")}
        onToggle={() => toggleSection("validation")}
      >
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

      {/* Dependencies */}
      <CollapsibleSection
        title="Зависимости"
        open={openSections.has("deps")}
        onToggle={() => toggleSection("deps")}
      >
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

      {/* Metadata */}
      <CollapsibleSection
        title="Метаданные"
        open={openSections.has("metadata")}
        onToggle={() => toggleSection("metadata")}
      >
        <div className="p-3 space-y-2 text-xs">
          <PropRow label="Создано" value={matrix.createdAt} />
          <PropRow label="ID" value={matrix.id} mono />
          <PropRow label="Строк" value={String(matrix.rows.length)} />
          <PropRow label="Активов" value={String(matrix.assets.reduce((acc, a) => acc + 1 + (a.children?.length || 0), 0))} />
        </div>
      </CollapsibleSection>

      {/* Shortcuts */}
      <div className="mt-auto p-2.5 border-t border-border">
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <Keyboard className="w-2.5 h-2.5" />
          <span>⌘Enter проверить · ⌘⇧S активировать · ESC закрыть</span>
        </div>
      </div>
    </div>
  );
}

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <Collapsible open={open} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-2 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors">
        <span>{title}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "" : "-rotate-90"}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="panel-section">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function PropRow({ label, value, badge, mono }: { label: string; value: string; badge?: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-foreground flex items-center gap-1.5 ${mono ? "font-mono text-[10px]" : "font-medium"}`}>
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
