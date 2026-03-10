import { useState } from "react";
import { Play, SkipForward, RotateCcw, CheckCircle, AlertTriangle, XCircle, Code, Sliders, Eye, EyeOff } from "lucide-react";
import { Rule } from "@/data/mockRules";
import { CausalChain, buildSimulationChain } from "@/components/ide/CausalChain";
import { StatusBadge } from "@/components/ui/status-badge";
import { SegmentBar } from "@/components/ui/segment-bar";

interface SimulationPanelProps {
  rule: Rule;
}

interface SignalField {
  name: string;
  value: string;
  unit: string;
  type: "number" | "select";
  options?: string[];
}

const defaultFields: Record<string, SignalField[]> = {
  "Температура": [
    { name: "Температура", value: "96", unit: "°C", type: "number" },
    { name: "Давление", value: "12", unit: "бар", type: "number" },
    { name: "Скорость насоса", value: "1450", unit: "RPM", type: "number" },
  ],
  "Давление": [
    { name: "Давление", value: "12.3", unit: "бар", type: "number" },
    { name: "Клапан", value: "ОТКРЫТ", unit: "", type: "select", options: ["ОТКРЫТ", "ЗАКРЫТ"] },
  ],
  "Скорость": [
    { name: "Скорость", value: "1450", unit: "RPM", type: "number" },
    { name: "Скорость нарастания", value: "150", unit: "RPM/с", type: "number" },
  ],
  "Уровень": [
    { name: "Уровень", value: "78", unit: "%", type: "number" },
  ],
  "Клапан": [
    { name: "Команда", value: "CLOSE", unit: "", type: "select", options: ["OPEN", "CLOSE"] },
    { name: "Проверка безопасности", value: "true", unit: "", type: "select", options: ["true", "false"] },
  ],
  "default": [
    { name: "Температура", value: "96", unit: "°C", type: "number" },
    { name: "Давление", value: "12", unit: "бар", type: "number" },
  ],
};

const ghostData: Record<string, { actual: number[]; predicted: number[] }> = {
  "Температура": { actual: [84, 85, 87, 89, 92, 95, 96], predicted: [84, 85, 86, 86, 87, 87, 88] },
  "Давление": { actual: [9.8, 10.2, 10.5, 11.0, 11.5, 11.8, 12.3], predicted: [9.8, 10.0, 10.1, 10.2, 10.3, 10.4, 10.5] },
  "Скорость": { actual: [1420, 1430, 1440, 1445, 1450, 1448, 1450], predicted: [1420, 1425, 1430, 1435, 1440, 1440, 1440] },
  "default": { actual: [84, 85, 87, 89, 92, 95, 96], predicted: [84, 85, 86, 86, 87, 87, 88] },
};

type EvalStep = {
  label: string;
  status: "pending" | "active" | "pass" | "fail" | "warning";
};

type TraceEntry = {
  expression: string;
  result: string;
  pass: boolean;
};

export function SimulationPanel({ rule }: SimulationPanelProps) {
  const initialFields = defaultFields[rule.parameterType] || defaultFields["default"];
  const [fields, setFields] = useState<SignalField[]>(initialFields);
  const [viewMode, setViewMode] = useState<"structured" | "json">("structured");
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [traces, setTraces] = useState<TraceEntry[]>([]);
  const [showGhost, setShowGhost] = useState(false);
  const [steps, setSteps] = useState<EvalStep[]>([
    { label: "Сигнал", status: "pending" },
    { label: "Условие", status: "pending" },
    { label: "Матрица", status: "pending" },
    { label: "Результат", status: "pending" },
  ]);

  const ghost = ghostData[rule.parameterType] || ghostData["default"];

  const jsonFromFields = () => {
    const obj: Record<string, unknown> = {};
    fields.forEach((f) => {
      obj[f.name] = f.type === "number" ? parseFloat(f.value) || 0 : f.value;
      if (f.unit) obj[f.name + "_unit"] = f.unit;
    });
    obj["timestamp"] = "2026-03-10T09:34:00Z";
    obj["object"] = "Резервуар-12";
    return JSON.stringify(obj, null, 2);
  };

  const updateField = (index: number, value: string) => {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, value } : f)));
  };

  const resetSimulation = () => {
    setOutput(null);
    setCurrentStep(-1);
    setTraces([]);
    setSteps((s) => s.map((st) => ({ ...st, status: "pending" })));
    setFields(defaultFields[rule.parameterType] || defaultFields["default"]);
  };

  const runStep = () => {
    const next = currentStep + 1;
    if (next >= steps.length) return;
    setCurrentStep(next);
    setSteps((s) =>
      s.map((st, i) => ({ ...st, status: i < next ? "pass" : i === next ? "active" : "pending" }))
    );
    if (next === steps.length - 1) {
      setTimeout(() => finishSimulation(), 300);
    }
  };

  const finishSimulation = () => {
    const tempField = fields.find(f => f.name === "Температура");
    const pressField = fields.find(f => f.name === "Давление");
    const tempVal = tempField ? parseFloat(tempField.value) : 96;
    const pressVal = pressField ? parseFloat(pressField.value) : 12;
    const triggered = tempVal > 90 && pressVal > 11;

    const mockTraces: TraceEntry[] =
      rule.parameterType === "Температура"
        ? [
            { expression: `Температура = ${tempVal}°C`, result: "получено", pass: true },
            { expression: `Давление = ${pressVal} бар`, result: "получено", pass: true },
            { expression: `Температура > 90°C`, result: tempVal > 90 ? "ИСТИНА" : "ЛОЖЬ", pass: tempVal <= 90 },
            { expression: `Давление > 11 бар`, result: pressVal > 11 ? "ИСТИНА" : "ЛОЖЬ", pass: pressVal <= 11 },
            { expression: `Правило: ${rule.name}`, result: triggered ? "АКТИВИРУЕТСЯ" : "НЕ АКТИВИРУЕТСЯ", pass: !triggered },
            { expression: `Клапан XV-R12-01`, result: triggered ? "ЗАКРЫВАЕТСЯ" : "БЕЗ ИЗМЕНЕНИЙ", pass: !triggered },
          ]
        : [
            { expression: `${fields[0]?.name} = ${fields[0]?.value}`, result: "получено", pass: true },
            { expression: `Проверка диапазона`, result: rule.warningCount > 0 ? "ПРЕДУПРЕЖДЕНИЕ" : "OK", pass: rule.warningCount === 0 },
            { expression: `Правило: ${rule.name}`, result: "выполнено", pass: true },
          ];
    setTraces(mockTraces);
    setOutput(JSON.stringify({
      rule: rule.name,
      triggered,
      result: triggered ? "Правило активируется. Клапан закрывается." : "Правило не активируется. Продолжить работу.",
      timestamp: "2026-03-10T09:34:00Z",
      object: "Резервуар-12",
    }, null, 2));
    setSteps((s) =>
      s.map((st) => ({ ...st, status: triggered ? (st.label === "Результат" ? "fail" : "pass") : "pass" }))
    );
    setCurrentStep(steps.length);
  };

  const runFullSimulation = () => {
    setRunning(true);
    setCurrentStep(0);
    setSteps((s) => s.map((st, i) => ({ ...st, status: i === 0 ? "active" : "pending" })));
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= steps.length) {
        clearInterval(interval);
        finishSimulation();
        setRunning(false);
        return;
      }
      setCurrentStep(step);
      setSteps((s) =>
        s.map((st, i) => ({ ...st, status: i < step ? "pass" : i === step ? "active" : "pending" }))
      );
    }, 400);
  };

  const stepVariant = (status: EvalStep["status"]) => {
    switch (status) {
      case "pass": return "success" as const;
      case "fail": return "error" as const;
      case "warning": return "warning" as const;
      case "active": return "neutral" as const;
      default: return "idle" as const;
    }
  };

  return (
    <div className="p-4 space-y-3 animate-fade-in">
      {/* Execution Timeline */}
      <div className="vercel-card">
        <div className="ide-header">Поток выполнения</div>
        <div className="p-3">
          <div className="flex items-center gap-1">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-1">
                <StatusBadge variant={stepVariant(step.status)} size="sm" dot={step.status !== "pending"}>
                  {step.status === "pass" && <CheckCircle className="w-2.5 h-2.5 inline mr-0.5" />}
                  {step.label}
                </StatusBadge>
                {i < steps.length - 1 && (
                  <div className={`w-6 h-px ${step.status === "pass" || step.status === "active" ? "bg-foreground/30" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
          <SegmentBar
            className="mt-2.5"
            segments={steps.map((step) => ({
              color: step.status === "pass" ? "hsl(142, 71%, 45%)"
                : step.status === "active" ? "hsl(217, 91%, 60%)"
                : step.status === "fail" ? "hsl(0, 84%, 60%)"
                : "hsl(0, 0%, 18%)",
              active: step.status !== "pending",
            }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Input */}
        <div className="vercel-card">
          <div className="ide-header flex items-center justify-between">
            <span>Входные данные</span>
            <div className="flex gap-0.5 bg-muted rounded-md p-0.5 normal-case tracking-normal">
              <button
                onClick={() => setViewMode("structured")}
                className={`px-2 py-0.5 rounded-md text-[9px] font-medium transition-all ${viewMode === "structured" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Sliders className="w-3 h-3 inline-block mr-0.5" />Поля
              </button>
              <button
                onClick={() => setViewMode("json")}
                className={`px-2 py-0.5 rounded-md text-[9px] font-medium transition-all ${viewMode === "json" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Code className="w-3 h-3 inline-block mr-0.5" />JSON
              </button>
            </div>
          </div>
          {viewMode === "structured" ? (
            <div className="p-3 space-y-2">
              {fields.map((field, i) => (
                <div key={i} className="text-xs flex items-center gap-0">
                  <label className="w-32 text-muted-foreground truncate">{field.name}</label>
                  {field.type === "select" ? (
                    <select
                      value={field.value}
                      onChange={(e) => updateField(i, e.target.value)}
                      className="flex-1 bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                    >
                      {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => updateField(i, e.target.value)}
                      className="flex-1 bg-background border border-border rounded-lg px-2 py-1.5 text-xs font-mono text-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                    />
                  )}
                  {field.unit && <span className="text-[10px] text-muted-foreground w-12 px-2">{field.unit}</span>}
                </div>
              ))}
            </div>
          ) : (
            <textarea
              value={jsonFromFields()}
              readOnly
              className="w-full h-40 bg-background text-foreground text-xs font-mono p-3 resize-none focus:outline-none border-none"
              spellCheck={false}
            />
          )}
        </div>

        {/* Output */}
        <div className="vercel-card">
          <div className="ide-header">Результат</div>
          <div className="h-40 overflow-auto">
            {output ? (
              <pre className="p-3 text-xs font-mono text-success">{output}</pre>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                Запустите тест для просмотра результата
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signal Ghost Mode */}
      <div className="vercel-card">
        <div className="ide-header flex items-center justify-between">
          <span>Прогноз сигнала</span>
          <button
            onClick={() => setShowGhost(!showGhost)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium normal-case tracking-normal transition-all ${
              showGhost ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {showGhost ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {showGhost ? "Прогноз вкл" : "Показать прогноз"}
          </button>
        </div>
        <div className="p-3">
          <GhostSparkline actual={ghost.actual} predicted={ghost.predicted} showGhost={showGhost} />
          <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-foreground/70 inline-block rounded-full" /> Фактическое
            </span>
            {showGhost && (
              <span className="flex items-center gap-1.5 animate-fade-in">
                <span className="w-3 h-0.5 inline-block rounded-full border-t border-dashed border-foreground/40" /> Прогноз
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={runFullSimulation}
          disabled={running}
          className="btn-primary rounded-lg disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5" />
          {running ? "Выполняется..." : "Запустить"}
        </button>
        <button onClick={runStep} disabled={running} className="btn-secondary rounded-lg">
          <SkipForward className="w-3.5 h-3.5" /> Шаг
        </button>
        <button onClick={resetSimulation} className="btn-secondary rounded-lg">
          <RotateCcw className="w-3.5 h-3.5" /> Сброс
        </button>
      </div>

      {/* Causal Chain */}
      {traces.length > 0 && (
        <CausalChain
          title="Как работает правило"
          steps={buildSimulationChain(
            fields.map((f) => ({ name: f.name, value: f.value })),
            rule.name,
            rule.errorCount > 0
          )}
        />
      )}

      {/* Evaluation Trace */}
      {traces.length > 0 && (
        <div className="vercel-card">
          <div className="ide-header">Трассировка вычислений</div>
          <div className="p-2 space-y-0.5 text-xs font-mono">
            {traces.map((trace, i) => (
              <div key={i} className={`flex items-start gap-1.5 py-1 px-2 rounded-md ${trace.pass ? "text-muted-foreground" : "text-destructive bg-destructive/5"}`}>
                {trace.pass ? <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-success" /> : <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                <span className="text-foreground">{trace.expression}</span>
                <span className="ml-auto text-[10px]">→ {trace.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GhostSparkline({ actual, predicted, showGhost }: { actual: number[]; predicted: number[]; showGhost: boolean }) {
  const all = [...actual, ...predicted];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = max - min || 1;
  const w = 320;
  const h = 48;

  const toPoints = (data: number[]) =>
    data.map((v, i) => ({
      x: (i / (data.length - 1)) * w,
      y: h - ((v - min) / range) * (h - 8) - 4,
    })).map((p) => `${p.x},${p.y}`).join(" ");

  const actualLine = toPoints(actual);
  const predictedLine = toPoints(predicted);
  const areaPoints = `0,${h} ${actualLine} ${w},${h}`;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="ghostArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(0, 0%, 93%)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="hsl(0, 0%, 93%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#ghostArea)" />
      <polyline points={actualLine} fill="none" stroke="hsl(0, 0%, 70%)" strokeWidth="1.5" strokeLinejoin="round" />
      {showGhost && (
        <polyline
          points={predictedLine}
          fill="none"
          stroke="hsl(0, 0%, 50%)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.5"
          strokeLinejoin="round"
          className="animate-fade-in"
        />
      )}
      {actual.map((v, i) => {
        const x = (i / (actual.length - 1)) * w;
        const y = h - ((v - min) / range) * (h - 8) - 4;
        return <circle key={i} cx={x} cy={y} r="2" fill="hsl(0, 0%, 93%)" opacity="0.6" />;
      })}
    </svg>
  );
}
