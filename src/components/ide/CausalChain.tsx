import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, Clock, XCircle } from "lucide-react";

export interface CausalStep {
  type: "signal" | "function" | "matrix" | "result" | "incident";
  label: string;
  value?: string;
  details?: string[];
  status?: "ok" | "warning" | "error";
  meta?: { lastRun?: string; errors?: number };
}

interface CausalChainProps {
  title: string;
  steps: CausalStep[];
  onStepClick?: (step: CausalStep) => void;
}

const typeLabels: Record<CausalStep["type"], string> = {
  signal: "Сигнал",
  function: "Функция",
  matrix: "Матрица",
  result: "Результат",
  incident: "Инцидент",
};

const typeColors: Record<CausalStep["type"], string> = {
  signal: "border-[hsl(212,92%,58%)] bg-[hsl(212,92%,58%)]/10 text-[hsl(212,92%,58%)]",
  function: "border-[hsl(271,60%,55%)] bg-[hsl(271,60%,55%)]/10 text-[hsl(271,60%,55%)]",
  matrix: "border-[hsl(39,74%,48%)] bg-[hsl(39,74%,48%)]/10 text-[hsl(39,74%,48%)]",
  result: "border-[hsl(140,60%,40%)] bg-[hsl(140,60%,40%)]/10 text-[hsl(140,60%,40%)]",
  incident: "border-[hsl(2,93%,63%)] bg-[hsl(2,93%,63%)]/10 text-[hsl(2,93%,63%)]",
};

const dotColors: Record<CausalStep["type"], string> = {
  signal: "bg-[hsl(212,92%,58%)]",
  function: "bg-[hsl(271,60%,55%)]",
  matrix: "bg-[hsl(39,74%,48%)]",
  result: "bg-[hsl(140,60%,40%)]",
  incident: "bg-[hsl(2,93%,63%)]",
};

const lineColors: Record<CausalStep["type"], string> = {
  signal: "border-[hsl(212,92%,58%)]/30",
  function: "border-[hsl(271,60%,55%)]/30",
  matrix: "border-[hsl(39,74%,48%)]/30",
  result: "border-[hsl(140,60%,40%)]/30",
  incident: "border-[hsl(2,93%,63%)]/30",
};

export function CausalChain({ title, steps, onStepClick }: CausalChainProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="ide-panel rounded-sm">
      <div className="ide-header">{title}</div>
      <div className="p-3">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            {/* Vertical line + dot */}
            <div className="flex flex-col items-center w-3 flex-shrink-0">
              <div className={`w-2.5 h-2.5 rounded-full ${dotColors[step.type]} flex-shrink-0 mt-1.5`} />
              {i < steps.length - 1 && (
                <div className={`w-0 flex-1 border-l-2 ${lineColors[step.type]} my-0.5`} />
              )}
            </div>

            {/* Block */}
            <div className="flex-1 mb-2">
              <button
                onClick={() => onStepClick?.(step)}
                className={`w-full text-left border rounded-sm px-3 py-2 transition-colors hover:brightness-125 ${typeColors[step.type]}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] uppercase tracking-wider opacity-70">{typeLabels[step.type]}</span>
                  {step.status === "error" && <XCircle className="w-3 h-3 text-destructive" />}
                  {step.status === "warning" && <AlertTriangle className="w-3 h-3 text-warning" />}
                </div>
                <div className="text-xs font-medium mt-0.5 text-foreground">{step.label}</div>
                {step.value && (
                  <div className="text-[10px] font-mono mt-0.5 opacity-80">{step.value}</div>
                )}
              </button>

              {/* Tooltip-like meta on hover — rendered as expandable details */}
              {step.meta && (
                <div className="mt-0.5 flex items-center gap-2 text-[9px] text-muted-foreground px-1">
                  {step.meta.lastRun && (
                    <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{step.meta.lastRun}</span>
                  )}
                  {step.meta.errors !== undefined && (
                    <span>Ошибки: {step.meta.errors}</span>
                  )}
                </div>
              )}

              {/* Expandable details */}
              {step.details && step.details.length > 0 && (
                <div className="mt-1 px-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedIdx(expandedIdx === i ? null : i);
                    }}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {expandedIdx === i ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    Показать подробности
                  </button>
                  {expandedIdx === i && (
                    <div className="mt-1 pl-4 space-y-0.5 animate-fade-in">
                      {step.details.map((d, j) => (
                        <div key={j} className="text-[10px] font-mono text-muted-foreground">{d}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Preset chain builders ───

export function buildIncidentChain(incident: {
  linkedParameters: string[];
  linkedFunctions: string[];
  linkedMatrices: string[];
  title: string;
  description: string;
}): CausalStep[] {
  const steps: CausalStep[] = [];

  incident.linkedParameters.forEach(p => {
    steps.push({
      type: "signal",
      label: p,
      value: "Отклонение зафиксировано",
      meta: { lastRun: "2 мин назад", errors: 0 },
    });
  });

  incident.linkedFunctions.forEach(f => {
    steps.push({
      type: "function",
      label: f,
      details: [`Условие: ${f.includes("температур") ? "Температура > 90" : "Значение вне диапазона"}`],
      meta: { lastRun: "2 мин назад", errors: 0 },
    });
  });

  incident.linkedMatrices.forEach(m => {
    steps.push({
      type: "matrix",
      label: m,
      details: ["Критические пороги применены"],
      meta: { lastRun: "2 мин назад", errors: 0 },
    });
  });

  steps.push({
    type: "result",
    label: "Обнаружено отклонение",
    value: "Сформирован инцидент",
    status: "error",
  });

  steps.push({
    type: "incident",
    label: incident.title,
    value: incident.description.substring(0, 80) + "…",
    status: "error",
  });

  return steps;
}

export function buildSimulationChain(fields: { name: string; value: string }[], ruleName: string, hasError: boolean): CausalStep[] {
  const steps: CausalStep[] = [];

  steps.push({
    type: "signal",
    label: "Входные сигналы",
    value: fields.map(f => `${f.name} = ${f.value}`).join(", "),
    details: fields.map(f => `${f.name} = ${f.value}`),
  });

  steps.push({
    type: "function",
    label: ruleName,
    value: hasError ? "Условие сработало" : "Условие не сработало",
    status: hasError ? "error" : "ok",
    details: [
      `Проверка условий: ${hasError ? "ИСТИНА" : "ЛОЖЬ"}`,
    ],
  });

  steps.push({
    type: "matrix",
    label: "Критические пороги",
    value: hasError ? "Уровень 3" : "В норме",
  });

  steps.push({
    type: "result",
    label: hasError ? "Остановить клапан" : "Продолжить работу",
    status: hasError ? "error" : "ok",
  });

  return steps;
}

export function buildReportChain(report: {
  linkedParameters: string[];
  linkedFunctions: string[];
  linkedMatrices: string[];
  name: string;
}): CausalStep[] {
  const steps: CausalStep[] = [];

  report.linkedParameters.slice(0, 2).forEach(p => {
    steps.push({ type: "signal", label: p, value: "Данные за период" });
  });

  report.linkedFunctions.slice(0, 2).forEach(f => {
    steps.push({ type: "function", label: f, details: ["Обработка данных"] });
  });

  report.linkedMatrices.slice(0, 1).forEach(m => {
    steps.push({ type: "matrix", label: m });
  });

  steps.push({
    type: "result",
    label: report.name,
    value: "Отчёт сформирован",
    status: "ok",
  });

  return steps;
}
