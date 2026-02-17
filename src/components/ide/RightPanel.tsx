import { useState } from "react";
import { Rule, statusLabels } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, Keyboard } from "lucide-react";

interface RightPanelProps {
  rule: Rule;
}

export function RightPanel({ rule }: RightPanelProps) {
  const [code, setCode] = useState(rule.code);

  // Reset code when rule changes
  if (code !== rule.code && !code.startsWith("//")) {
    // Only reset if it looks like the rule actually changed
  }

  return (
    <div className="w-[320px] min-w-[320px] border-l border-border flex flex-col h-full bg-card">
      {/* Properties */}
      <div className="border-b border-border">
        <div className="ide-header">Свойства</div>
        <div className="p-3 space-y-2 text-xs">
          <PropRow label="Название" value={rule.name} />
          <PropRow label="Тип" value={rule.parameterType} />
          <PropRow label="Статус" value={statusLabels[rule.status]} badge={rule.status} />
          <PropRow label="Версия" value={`v${rule.version}`} />
          <PropRow label="Автор" value={rule.author} />
          <PropRow label="Проверка" value={rule.lastCheck} />
        </div>
      </div>

      {/* Code editor */}
      <div className="flex-1 flex flex-col min-h-0 border-b border-border">
        <div className="ide-header">Редактор функции</div>
        <div className="flex-1 flex min-h-0">
          {/* Line numbers */}
          <div className="py-2 pl-2 pr-1 text-right select-none">
            {rule.code.split("\n").map((_, i) => (
              <div key={i} className="text-[10px] text-muted-foreground leading-[18px] font-mono">
                {i + 1}
              </div>
            ))}
          </div>
          <textarea
            value={rule.code}
            readOnly
            className="flex-1 bg-background text-foreground text-[11px] font-mono p-2 resize-none focus:outline-none leading-[18px] overflow-auto"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Validation */}
      <div className="border-b border-border">
        <div className="ide-header">Консоль проверки</div>
        <div className="p-2 space-y-0.5 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-success">
            <CheckCircle className="w-3 h-3 flex-shrink-0" />
            Синтаксис OK
          </div>
          {rule.warningCount > 0 && (
            <div className="flex items-center gap-1.5 text-warning">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              {rule.warningCount} предупр.
            </div>
          )}
          {rule.errorCount > 0 && (
            <div className="flex items-center gap-1.5 text-destructive">
              <XCircle className="w-3 h-3 flex-shrink-0" />
              {rule.errorCount} ошибок
            </div>
          )}
        </div>
      </div>

      {/* Shortcuts */}
      <div className="p-2">
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
      <span className="text-foreground flex items-center gap-1.5">
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
