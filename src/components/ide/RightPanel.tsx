import { Rule, statusLabels } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, Keyboard, ChevronDown, Cpu, Link2, FileText, Zap } from "lucide-react";
import { useState } from "react";
import { StatusBadge, ruleStatusToVariant } from "@/components/ui/status-badge";
import { CollapsibleSection, PropRow } from "@/components/ui/collapsible-section";

interface RightPanelProps {
  rule: Rule;
}

const mockSparklineData: Record<string, number[]> = {
  "Температура": [84, 85, 87, 89, 92, 95, 96],
  "Давление": [9.8, 10.2, 10.5, 11.0, 11.5, 11.8, 12.3],
  "Скорость": [1420, 1430, 1440, 1445, 1450, 1448, 1450],
  "Уровень": [80, 79, 79, 78, 78, 78, 78],
  "Клапан": [1, 1, 1, 1, 1, 1, 0],
  "Общее": [50, 55, 52, 58, 54, 56, 53],
};

const templates = [
  { id: "t1", name: "Контроль перегрева", icon: "🔥" },
  { id: "t2", name: "Аварийное давление", icon: "⚡" },
  { id: "t3", name: "Отказ клапана", icon: "🔧" },
];

function Sparkline({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 140;
  const h = 28;
  const pts = data.map((v, i) => ({
    x: i / (data.length - 1) * w,
    y: h - (v - min) / range * (h - 6) - 3
  }));
  const linePoints = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `0,${h} ${linePoints} ${w},${h}`;

  return (
    <svg width={w} height={h} className="inline-block">
      <defs>
        <linearGradient id="sparkGlowLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(185, 70%, 50%)" stopOpacity="0.3" />
          <stop offset="50%" stopColor="hsl(180, 80%, 60%)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(185, 70%, 50%)" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="sparkGlowArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(185, 70%, 50%)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(185, 70%, 50%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#sparkGlowArea)" />
      <polyline points={linePoints} fill="none" stroke="url(#sparkGlowLine)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function RightPanel({ rule }: RightPanelProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["logic", "signals", "validation", "metadata"])
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const sparkData = mockSparklineData[rule.parameterType] || mockSparklineData["Общее"];

  return (
    <div className="w-[300px] min-w-[300px] border-l border-border flex flex-col h-full bg-card overflow-y-auto">
      <CollapsibleSection title="Логика правила" open={openSections.has("logic")} onToggle={() => toggleSection("logic")}>
        <div className="p-3 space-y-2 text-xs">
          <PropRow label="Название" value={rule.name} />
          <PropRow label="Тип" value={rule.parameterType} />
          <PropRow label="Статус">
            <StatusBadge variant={ruleStatusToVariant(rule.status)}>
              {statusLabels[rule.status]}
            </StatusBadge>
          </PropRow>
          <PropRow label="Версия" value={`v${rule.version}`} />

          {/* Explain Logic */}
          {rule.name === "Контроль перегрева" && (
            <div className="mt-2 p-2 rounded-md border border-primary/20 bg-primary/5 text-[10px] text-foreground leading-relaxed">
              <div className="text-[9px] text-primary uppercase tracking-wider font-semibold mb-1">Пояснение логики</div>
              Температура достигла 96°C, что превысило порог 90°C. Давление 12.3 бар также выше нормы 11 бар. Это активировало функцию аварийной защиты и закрытие клапана подачи.
            </div>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Входные сигналы" open={openSections.has("signals")} onToggle={() => toggleSection("signals")}>
        <div className="p-3 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Тип параметра</span>
            <span className="text-foreground font-medium">{rule.parameterType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Последние значения</span>
            <Sparkline data={sparkData} />
          </div>
          <div className="flex gap-1 flex-wrap justify-end">
            {sparkData.map((v, i) =>
              <span key={i} className="sparkline-value">{v}</span>
            )}
          </div>
          {rule.parameterType === "Температура" &&
            <div className="flex items-start gap-1.5 text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/20">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span className="text-[10px] font-medium">Текущее значение 96°C превышает порог 90°C</span>
            </div>
          }
          {rule.parameterType === "Давление" &&
            <div className="flex items-start gap-1.5 text-warning bg-warning/10 p-2 rounded-md border border-warning/20">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span className="text-[10px] font-medium">Давление 12.3 бар приближается к критическому</span>
            </div>
          }
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Консоль проверки" open={openSections.has("validation")} onToggle={() => toggleSection("validation")}>
        <div className="p-3 space-y-1 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-success">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Синтаксис OK
          </div>
          {rule.warningCount > 0 &&
            <div className="flex items-center gap-1.5 text-warning">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              {rule.warningCount} предупр.
            </div>
          }
          {rule.errorCount > 0 &&
            <div className="flex items-center gap-1.5 text-destructive">
              <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {rule.errorCount} ошибок
            </div>
          }
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Зависимости" open={openSections.has("deps")} onToggle={() => toggleSection("deps")}>
        <div className="p-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Link2 className="w-3 h-3" />
            <span>{rule.parametersLinked} сигналов</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FileText className="w-3 h-3" />
            <span>{rule.reportsUsed} отчётов</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Cpu className="w-3 h-3" />
            <span>2 правила</span>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Метаданные" open={openSections.has("metadata")} onToggle={() => toggleSection("metadata")}>
        <div className="p-3 space-y-2 text-xs">
          <PropRow label="Автор" value={rule.author} />
          <PropRow label="Создано" value={rule.createdAt} />
          <PropRow label="Проверка" value={rule.lastCheck} />
          <PropRow label="Объект" value="Резервуар-12" />
          <PropRow label="ID" value={rule.id} mono />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Шаблоны" open={openSections.has("templates")} onToggle={() => toggleSection("templates")}>
        <div className="p-2 space-y-0.5">
          {templates.map((t) =>
            <button
              key={t.id}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
              <Zap className="w-3 h-3" />
              <span>{t.name}</span>
            </button>
          )}
        </div>
      </CollapsibleSection>

      <div className="p-2.5 border-t border-border mt-auto">
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <Keyboard className="w-2.5 h-2.5" />
          <span>⌘Enter проверить · ⌘⇧S активировать · ESC закрыть</span>
        </div>
      </div>
    </div>
  );
}
