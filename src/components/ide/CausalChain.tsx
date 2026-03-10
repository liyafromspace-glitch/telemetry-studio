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
  function: "Правило",
  matrix: "Матрица",
  result: "Результат",
  incident: "Инцидент",
};

const typeColors: Record<CausalStep["type"], string> = {
  signal: "border-primary bg-primary/10 text-primary",
  function: "border-[hsl(271,60%,55%)] bg-[hsl(271,60%,55%)]/10 text-[hsl(271,60%,55%)]",
  matrix: "border-warning bg-warning/10 text-warning",
  result: "border-success bg-success/10 text-success",
  incident: "border-destructive bg-destructive/10 text-destructive",
};

const dotColors: Record<CausalStep["type"], string> = {
  signal: "bg-primary",
  function: "bg-[hsl(271,60%,55%)]",
  matrix: "bg-warning",
  result: "bg-success",
  incident: "bg-destructive",
};

const lineColors: Record<CausalStep["type"], string> = {
  signal: "border-primary/30",
  function: "border-[hsl(271,60%,55%)]/30",
  matrix: "border-warning/30",
  result: "border-success/30",
  incident: "border-destructive/30",
};

export function CausalChain({ title, steps, onStepClick }: CausalChainProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="vercel-card">
      <div className="ide-header">{title}</div>
      <div className="p-3">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center w-3 flex-shrink-0">
              <div className={`w-2.5 h-2.5 rounded-full ${dotColors[step.type]} flex-shrink-0 mt-1.5`} style={{ boxShadow: `0 0 6px hsl(var(--glow) / 0.3)` }} />
              {i < steps.length - 1 && (
                <div className={`w-0 flex-1 border-l-2 ${lineColors[step.type]} my-0.5`} />
              )}
            </div>

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

export function buildIncidentChain(incident: {
  linkedParameters: string[];
  linkedFunctions: string[];
  linkedMatrices: string[];
  title: string;
  description: string;
}): CausalStep[] {
  const steps: CausalStep[] = [];

  // Signal steps
  steps.push({
    type: "signal",
    label: "Температура резервуара",
    value: "TI-R12-01.PV = 96°C (порог: 90°C)",
    meta: { lastRun: "09:34", errors: 0 },
    details: ["Рост с 84°C за 6 минут", "Корреляция с давлением: 0.87"],
  });
  if (incident.linkedParameters.length > 1) {
    steps.push({
      type: "signal",
      label: "Давление линии",
      value: "PI-R12-01.PV = 12.3 бар (порог: 11 бар)",
      meta: { lastRun: "09:33", errors: 0 },
    });
  }

  // Function steps
  steps.push({
    type: "function",
    label: "Контроль перегрева",
    value: "Условие: T > 90°C И P > 11 бар → TRUE",
    details: ["Температура 96°C > 90°C: ИСТИНА", "Давление 12.3 бар > 11 бар: ИСТИНА", "Результат: активация аварийной защиты"],
    meta: { lastRun: "09:34", errors: 0 },
    status: "error",
  });

  // Matrix step
  steps.push({
    type: "matrix",
    label: "Аварийная защита резервуара",
    value: "Клапан XV-R12-01 → ЗАКРЫТ",
    details: ["Перекрытие подачи по правилу аварийной защиты"],
    meta: { lastRun: "09:35", errors: 0 },
  });

  // Result
  steps.push({
    type: "result",
    label: "Перекрытие клапана подачи",
    value: "XV-R12-01 переведён в состояние ЗАКРЫТ",
    status: "error",
  });

  // Incident
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
  const tempField = fields.find(f => f.name === "Температура");
  const pressField = fields.find(f => f.name === "Давление");
  const tempVal = tempField ? parseFloat(tempField.value) : 0;
  const pressVal = pressField ? parseFloat(pressField.value) : 0;
  const triggered = tempVal > 90 && pressVal > 11;

  steps.push({
    type: "signal",
    label: "Входные сигналы",
    value: fields.map(f => `${f.name} = ${f.value}`).join(", "),
    details: fields.map(f => `${f.name} = ${f.value}`),
  });
  steps.push({
    type: "function",
    label: ruleName,
    value: triggered ? "Условие выполнено → правило активируется" : "Условие не выполнено",
    status: triggered ? "error" : "ok",
    details: [
      `Температура ${tempVal}°C ${tempVal > 90 ? ">" : "≤"} 90°C: ${tempVal > 90 ? "ИСТИНА" : "ЛОЖЬ"}`,
      `Давление ${pressVal} бар ${pressVal > 11 ? ">" : "≤"} 11 бар: ${pressVal > 11 ? "ИСТИНА" : "ЛОЖЬ"}`,
    ],
  });
  steps.push({
    type: "matrix",
    label: "Аварийная защита резервуара",
    value: triggered ? "Клапан → ЗАКРЫТ" : "Без изменений",
  });
  steps.push({
    type: "result",
    label: triggered ? "Клапан закрывается" : "Продолжить работу",
    status: triggered ? "error" : "ok",
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
  report.linkedParameters.slice(0, 2).forEach(p => { steps.push({ type: "signal", label: p, value: "Данные за период" }); });
  report.linkedFunctions.slice(0, 2).forEach(f => { steps.push({ type: "function", label: f, details: ["Обработка и проверка условий"] }); });
  report.linkedMatrices.slice(0, 1).forEach(m => { steps.push({ type: "matrix", label: m }); });
  steps.push({ type: "result", label: report.name, value: "Отчёт сформирован", status: "ok" });
  return steps;
}
