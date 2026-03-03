import { Rule, statusLabels } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, Keyboard, ChevronDown, Cpu, Link2, FileText, Zap } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface RightPanelProps {
  rule: Rule;
}

// Mock sparkline data
const mockSparklineData: Record<string, number[]> = {
  "Влажность": [72, 74, 75, 73, 78, 76, 75],
  "Температура": [82, 84, 85, 83, 86, 85, 84],
  "Уровень нефти": [4.1, 4.2, 4.15, 4.3, 4.21, 4.18, 4.25],
  "Давление": [340, 355, 370, 390, 400, 412, 410],
  "Плотность": [840, 841, 842, 841, 843, 842, 842],
  "Расход": [900, 950, 1000, 1050, 1100, 1200, 1247],
  "Общее": [50, 55, 52, 58, 54, 56, 53],
};

const templates = [
  { id: "t1", name: "Контроль перегрева", icon: "🔥" },
  { id: "t2", name: "Аномалия давления", icon: "⚡" },
  { id: "t3", name: "Отказ клапана", icon: "🔧" },
];

function Sparkline({ data, color = "hsl(var(--primary))" }: { data: number[]; color?: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 20;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");

  return (
    <svg width={w} height={h} className="inline-block">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function RightPanel({ rule }: RightPanelProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["logic", "signals", "validation", "metadata"])
  );

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const sparkData = mockSparklineData[rule.parameterType] || mockSparklineData["Общее"];

  return (
    <div className="w-[320px] min-w-[320px] border-l border-border flex flex-col h-full bg-card overflow-y-auto">
      {/* Logic section */}
      <CollapsibleSection
        id="logic"
        title="Логика"
        open={openSections.has("logic")}
        onToggle={() => toggleSection("logic")}
      >
        <div className="p-3 space-y-2 text-xs">
          <PropRow label="Название" value={rule.name} />
          <PropRow label="Тип" value={rule.parameterType} />
          <PropRow label="Статус" value={statusLabels[rule.status]} badge={rule.status} />
          <PropRow label="Версия" value={`v${rule.version}`} />
        </div>
      </CollapsibleSection>

      {/* Input Signals section */}
      <CollapsibleSection
        id="signals"
        title="Входные сигналы"
        open={openSections.has("signals")}
        onToggle={() => toggleSection("signals")}
      >
        <div className="p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Тип параметра</span>
            <span className="text-foreground">{rule.parameterType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Последние значения</span>
            <Sparkline data={sparkData} />
          </div>
          <div className="text-[10px] text-muted-foreground font-mono flex gap-1 flex-wrap justify-end">
            {sparkData.map((v, i) => (
              <span key={i} className="px-1 py-0.5 bg-accent rounded-sm">{v}</span>
            ))}
          </div>
          {/* Inline validation */}
          {rule.parameterType === "Давление" && (
            <div className="flex items-start gap-1.5 text-warning bg-warning/10 p-1.5 rounded-sm">
              <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="text-[10px]">⚠ Допустимый диапазон: 0–350 бар</span>
            </div>
          )}
          {rule.parameterType === "Влажность" && (
            <div className="flex items-start gap-1.5 text-warning bg-warning/10 p-1.5 rounded-sm">
              <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="text-[10px]">⚠ Допустимый диапазон: 0–100 %RH</span>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Validation Console */}
      <CollapsibleSection
        id="validation"
        title="Консоль проверки"
        open={openSections.has("validation")}
        onToggle={() => toggleSection("validation")}
      >
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
      </CollapsibleSection>

      {/* Dependencies */}
      <CollapsibleSection
        id="deps"
        title="Зависимости"
        open={openSections.has("deps")}
        onToggle={() => toggleSection("deps")}
      >
        <div className="p-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Link2 className="w-3 h-3" />
            <span>{rule.parametersLinked} параметров</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FileText className="w-3 h-3" />
            <span>{rule.reportsUsed} отчётов</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Cpu className="w-3 h-3" />
            <span>2 функции</span>
          </div>
        </div>
      </CollapsibleSection>

      {/* Metadata */}
      <CollapsibleSection
        id="metadata"
        title="Метаданные"
        open={openSections.has("metadata")}
        onToggle={() => toggleSection("metadata")}
      >
        <div className="p-3 space-y-2 text-xs">
          <PropRow label="Автор" value={rule.author} />
          <PropRow label="Создано" value={rule.createdAt} />
          <PropRow label="Проверка" value={rule.lastCheck} />
          <PropRow label="ID" value={rule.id} mono />
        </div>
      </CollapsibleSection>

      {/* Templates */}
      <CollapsibleSection
        id="templates"
        title="Шаблоны"
        open={openSections.has("templates")}
        onToggle={() => toggleSection("templates")}
      >
        <div className="p-2 space-y-1">
          {templates.map((t) => (
            <button
              key={t.id}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-sm transition-colors"
            >
              <Zap className="w-3 h-3" />
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Shortcuts */}
      <div className="p-2 border-t border-border mt-auto">
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <Keyboard className="w-2.5 h-2.5" />
          <span>⌘Enter проверить · ⌘⇧S активировать · ESC закрыть</span>
        </div>
      </div>
    </div>
  );
}

function CollapsibleSection({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <Collapsible open={open} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-1.5 border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors">
        <span>{title}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "" : "-rotate-90"}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-b border-border">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function PropRow({ label, value, badge, mono }: { label: string; value: string; badge?: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-foreground flex items-center gap-1.5 ${mono ? "font-mono text-[10px]" : ""}`}>
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
