import { useState } from "react";
import { Play, SkipForward, RotateCcw, CheckCircle, AlertTriangle, XCircle, Code, Sliders } from "lucide-react";
import { Rule } from "@/data/mockRules";

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
  "Влажность": [
    { name: "Температура", value: "22", unit: "°C", type: "number" },
    { name: "Влажность", value: "75", unit: "%RH", type: "number" },
  ],
  "Температура": [
    { name: "sensor1", value: "95", unit: "°C", type: "number" },
    { name: "sensor2", value: "80", unit: "°C", type: "number" },
  ],
  "Давление": [
    { name: "Давление", value: "412", unit: "бар", type: "number" },
    { name: "Клапан", value: "ОТКРЫТ", unit: "", type: "select", options: ["ОТКРЫТ", "ЗАКРЫТ"] },
  ],
  "default": [
    { name: "value", value: "100", unit: "", type: "number" },
    { name: "temperature", value: "20", unit: "°C", type: "number" },
  ],
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
  const [steps, setSteps] = useState<EvalStep[]>([
    { label: "Сигнал", status: "pending" },
    { label: "Условие", status: "pending" },
    { label: "Матрица", status: "pending" },
    { label: "Результат", status: "pending" },
  ]);

  const jsonFromFields = () => {
    const obj: Record<string, unknown> = {};
    fields.forEach(f => {
      obj[f.name] = f.type === "number" ? parseFloat(f.value) || 0 : f.value;
      if (f.unit) obj[f.name + "_unit"] = f.unit;
    });
    obj["timestamp"] = "2024-02-20T10:00:00Z";
    return JSON.stringify(obj, null, 2);
  };

  const updateField = (index: number, value: string) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, value } : f));
  };

  const resetSimulation = () => {
    setOutput(null);
    setCurrentStep(-1);
    setTraces([]);
    setSteps(s => s.map(st => ({ ...st, status: "pending" })));
    setFields(defaultFields[rule.parameterType] || defaultFields["default"]);
  };

  const runStep = () => {
    const next = currentStep + 1;
    if (next >= steps.length) return;
    setCurrentStep(next);
    setSteps(s => s.map((st, i) => ({
      ...st,
      status: i < next ? "pass" : i === next ? "active" : "pending",
    })));

    if (next === steps.length - 1) {
      // Final step — produce result
      setTimeout(() => {
        finishSimulation();
      }, 300);
    }
  };

  const finishSimulation = () => {
    const mockTraces: TraceEntry[] = rule.parameterType === "Температура"
      ? [
          { expression: "sensor1 = 95", result: "получено", pass: true },
          { expression: "sensor2 = 80", result: "получено", pass: true },
          { expression: "delta = |95 - 80| = 15", result: "15°C", pass: true },
          { expression: "delta > MAX_DELTA (15)", result: rule.errorCount > 0 ? "ИСТИНА" : "ЛОЖЬ", pass: rule.errorCount === 0 },
          { expression: `Функция: ${rule.name}`, result: rule.errorCount > 0 ? "ТРЕВОГА" : "НОРМА", pass: rule.errorCount === 0 },
        ]
      : [
          { expression: `${fields[0]?.name} = ${fields[0]?.value}`, result: "получено", pass: true },
          { expression: `Проверка диапазона`, result: rule.warningCount > 0 ? "ПРЕДУПРЕЖДЕНИЕ" : "OK", pass: rule.warningCount === 0 },
          { expression: `Функция: ${rule.name}`, result: "выполнена", pass: true },
        ];

    setTraces(mockTraces);
    setOutput(JSON.stringify({
      processed: true,
      result: rule.errorCount > 0 ? "alarm" : "ok",
      timestamp: "2024-02-20T10:00:00Z",
    }, null, 2));
    setSteps(s => s.map(st => ({
      ...st,
      status: rule.errorCount > 0 ? (st.label === "Результат" ? "fail" : "pass") : "pass",
    })));
    setCurrentStep(steps.length);
  };

  const runFullSimulation = () => {
    setRunning(true);
    setCurrentStep(0);
    setSteps(s => s.map((st, i) => ({ ...st, status: i === 0 ? "active" : "pending" })));

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
      setSteps(s => s.map((st, i) => ({
        ...st,
        status: i < step ? "pass" : i === step ? "active" : "pending",
      })));
    }, 400);
  };

  return (
    <div className="p-4 space-y-3 animate-fade-in">
      {/* Execution Timeline */}
      <div className="ide-panel rounded-sm">
        <div className="ide-header">Поток выполнения</div>
        <div className="p-3 flex items-center gap-1">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`px-2 py-1 rounded-sm text-[10px] font-medium border transition-colors ${
                step.status === "active" ? "border-primary bg-primary/10 text-primary" :
                step.status === "pass" ? "border-success/50 bg-success/10 text-success" :
                step.status === "fail" ? "border-destructive/50 bg-destructive/10 text-destructive" :
                step.status === "warning" ? "border-warning/50 bg-warning/10 text-warning" :
                "border-border bg-secondary text-muted-foreground"
              }`}>
                {step.label}
              </div>
              {i < steps.length - 1 && (
                <span className={`text-[10px] ${step.status === "pass" || step.status === "active" ? "text-primary" : "text-muted-foreground"}`}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Input */}
        <div className="ide-panel rounded-sm">
          <div className="ide-header flex items-center justify-between">
            <span>Входные данные</span>
            <div className="flex gap-1 normal-case tracking-normal">
              <button
                onClick={() => setViewMode("structured")}
                className={`px-1.5 py-0.5 rounded-sm text-[9px] ${viewMode === "structured" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Sliders className="w-3 h-3 inline-block mr-0.5" />Поля
              </button>
              <button
                onClick={() => setViewMode("json")}
                className={`px-1.5 py-0.5 rounded-sm text-[9px] ${viewMode === "json" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Code className="w-3 h-3 inline-block mr-0.5" />JSON
              </button>
            </div>
          </div>
          {viewMode === "structured" ? (
            <div className="p-3 space-y-2">
              {fields.map((field, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <label className="w-24 text-muted-foreground truncate">{field.name}</label>
                  {field.type === "select" ? (
                    <select
                      value={field.value}
                      onChange={(e) => updateField(i, e.target.value)}
                      className="flex-1 bg-background border border-border rounded-sm px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                    >
                      {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => updateField(i, e.target.value)}
                      className="flex-1 bg-background border border-border rounded-sm px-2 py-1 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                    />
                  )}
                  {field.unit && (
                    <span className="text-[10px] text-muted-foreground w-10">{field.unit}</span>
                  )}
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
        <div className="ide-panel rounded-sm">
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

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={runFullSimulation}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5" />
          {running ? "Выполняется..." : "Запустить"}
        </button>
        <button
          onClick={runStep}
          disabled={running}
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground bg-secondary rounded-sm transition-colors"
        >
          <SkipForward className="w-3.5 h-3.5" />
          Шаг
        </button>
        <button
          onClick={resetSimulation}
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground bg-secondary rounded-sm transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Сброс
        </button>
      </div>

      {/* Evaluation Trace */}
      {traces.length > 0 && (
        <div className="ide-panel rounded-sm">
          <div className="ide-header">Трассировка вычислений</div>
          <div className="p-2 space-y-0.5 text-xs font-mono">
            {traces.map((trace, i) => (
              <div key={i} className={`flex items-start gap-1.5 py-0.5 ${
                trace.pass ? "text-muted-foreground" : "text-destructive"
              }`}>
                {trace.pass ? (
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-success" />
                ) : (
                  <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                )}
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
