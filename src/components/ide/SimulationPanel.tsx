import { useState } from "react";
import { Play, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Rule } from "@/data/mockRules";

interface SimulationPanelProps {
  rule: Rule;
}

const defaultInput = `{
  "value": 75,
  "unit": "%RH",
  "temperature": 22,
  "timestamp": "2024-02-01T12:00:00Z"
}`;

const mockOutput = `{
  "value": 12.847,
  "unit": "g/m³",
  "processed": true,
  "timestamp": "2024-02-01T12:00:00Z"
}`;

export function SimulationPanel({ rule }: SimulationPanelProps) {
  const [input, setInput] = useState(defaultInput);
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<{ level: "info" | "warning" | "error"; message: string }[]>([]);

  const runSimulation = () => {
    setRunning(true);
    setLogs([]);
    setTimeout(() => {
      setOutput(mockOutput);
      setLogs([
        { level: "info", message: "Запуск симуляции..." },
        { level: "info", message: "Входные данные: валидный JSON" },
        { level: "info", message: `Применяется правило: ${rule.name}` },
        ...(rule.warningCount > 0
          ? [{ level: "warning" as const, message: "Значение близко к верхней границе допустимого диапазона" }]
          : []),
        ...(rule.errorCount > 0
          ? [{ level: "error" as const, message: "Ошибка: выход за допустимый диапазон" }]
          : []),
        { level: "info", message: "Симуляция завершена за 23мс" },
      ]);
      setRunning(false);
    }, 800);
  };

  return (
    <div className="p-4 space-y-3 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Input */}
        <div className="ide-panel rounded-sm">
          <div className="ide-header">Входные данные (JSON)</div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 bg-background text-foreground text-xs font-mono p-3 resize-none focus:outline-none border-none"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="ide-panel rounded-sm">
          <div className="ide-header">Результат</div>
          <div className="h-48 overflow-auto">
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

      {/* Run button */}
      <button
        onClick={runSimulation}
        disabled={running}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Play className="w-3.5 h-3.5" />
        {running ? "Выполняется..." : "Запустить тест"}
      </button>

      {/* Error log */}
      {logs.length > 0 && (
        <div className="ide-panel rounded-sm">
          <div className="ide-header">Журнал выполнения</div>
          <div className="p-2 space-y-0.5 text-xs font-mono max-h-40 overflow-y-auto">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`flex items-start gap-1.5 py-0.5 ${
                  log.level === "error"
                    ? "text-destructive"
                    : log.level === "warning"
                      ? "text-warning"
                      : "text-muted-foreground"
                }`}
              >
                {log.level === "info" && <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                {log.level === "warning" && <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                {log.level === "error" && <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
