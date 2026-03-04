import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, CheckCircle, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { type Incident } from "@/data/mockPlatform";

interface PlaybackStep {
  nodeId: string;
  label: string;
  type: "signal" | "condition" | "function" | "matrix" | "incident";
  description: string;
}

const playbackByIncident: Record<string, PlaybackStep[]> = {
  "inc-001": [
    { nodeId: "sig", label: "TI03025.PV", type: "signal", description: "Сигнал: потеря данных (timeout > 60s)" },
    { nodeId: "cond", label: "Timeout > 60s", type: "condition", description: "Условие: TRUE — данные не обновляются" },
    { nodeId: "fn", label: "Конвертация температуры", type: "function", description: "Ошибка: нет входных данных" },
    { nodeId: "mx", label: "Матрица зависимостей СИ", type: "matrix", description: "Статус обновлён: Потеря сигнала" },
    { nodeId: "inc", label: "INC-2989", type: "incident", description: "Инцидент создан автоматически" },
  ],
  "inc-002": [
    { nodeId: "sig", label: "FT01007.PV", type: "signal", description: "Значение: 1247.3 м³/ч" },
    { nodeId: "cond", label: "Value > 1100", type: "condition", description: "Превышение верхней границы" },
    { nodeId: "fn", label: "Пересчет расхода", type: "function", description: "Выброс обнаружен" },
    { nodeId: "inc", label: "INC-3012", type: "incident", description: "Инцидент создан" },
  ],
  "inc-003": [
    { nodeId: "sig", label: "PT02012.PV", type: "signal", description: "Давление: 412.8 бар" },
    { nodeId: "cond", label: "Value > 350", type: "condition", description: "Превышение допустимого диапазона" },
    { nodeId: "fn", label: "Проверка давления", type: "function", description: "Валидация не пройдена" },
    { nodeId: "mx", label: "Матрица давления", type: "matrix", description: "Диапазон нарушен" },
    { nodeId: "inc", label: "INC-2950", type: "incident", description: "Инцидент создан" },
  ],
};

const defaultPlayback: PlaybackStep[] = [
  { nodeId: "sig", label: "Сигнал", type: "signal", description: "Данные получены" },
  { nodeId: "fn", label: "Функция", type: "function", description: "Обработка" },
  { nodeId: "inc", label: "Инцидент", type: "incident", description: "Создан" },
];

const typeConnColor: Record<string, string> = {
  signal: "conn-dot-blue",
  condition: "conn-dot-orange",
  function: "conn-dot-pink",
  matrix: "conn-dot-orange",
  incident: "conn-dot-pink",
};

const typeBadgeStyle: Record<string, string> = {
  signal: "status-badge-success",
  condition: "status-badge-warning",
  function: "status-badge-error",
  matrix: "status-badge-warning",
  incident: "status-badge-error",
};

interface IncidentPlaybackProps {
  incident: Incident;
}

export function IncidentPlayback({ incident }: IncidentPlaybackProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const steps = playbackByIncident[incident.id] || defaultPlayback;

  const reset = useCallback(() => {
    setCurrentStep(-1);
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (currentStep >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStep((p) => p + 1);
    }, 800 / speed);
    return () => clearTimeout(timer);
  }, [playing, currentStep, steps.length, speed]);

  const startPlayback = () => {
    if (currentStep >= steps.length - 1) setCurrentStep(-1);
    setPlaying(true);
    if (currentStep < 0) setCurrentStep(0);
  };

  return (
    <div className="vercel-card">
      <div className="ide-header flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Play className="w-3 h-3 text-foreground" />
          Воспроизведение инцидента
        </span>
        <div className="flex items-center gap-1 normal-case tracking-normal">
          <button onClick={reset} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <RotateCcw className="w-3 h-3" />
          </button>
          <button
            onClick={() => setSpeed(speed === 1 ? 2 : speed === 2 ? 4 : 1)}
            className="px-1.5 py-0.5 rounded-md text-[9px] font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {speed}x
          </button>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Vercel-style chain visualization */}
        <div className="space-y-0">
          {steps.map((step, i) => {
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            const isPending = i > currentStep && currentStep >= 0;

            return (
              <div key={i} className="flex items-stretch gap-0">
                {/* Vertical connection line + dot */}
                <div className="flex flex-col items-center w-6 flex-shrink-0">
                  {i > 0 && (
                    <div className={`w-px flex-1 transition-all duration-200 ${isDone || isActive ? "bg-foreground/30" : "bg-border"}`} />
                  )}
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 transition-all duration-200 ${
                    isDone ? "bg-success" : isActive ? "bg-foreground shadow-[0_0_8px_hsl(0,0%,100%/0.3)]" : "bg-muted"
                  }`}>
                    {isDone && <CheckCircle className="w-3 h-3 text-background" />}
                    {isActive && playing && <Loader2 className="w-3 h-3 text-background animate-spin" />}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-px flex-1 transition-all duration-200 ${isDone ? "bg-foreground/30" : "bg-border"}`} />
                  )}
                </div>

                {/* Step card */}
                <div className={`flex-1 ml-2 py-1.5 transition-all duration-200 ${isActive ? "opacity-100" : isDone ? "opacity-60" : "opacity-30"}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">
                      {step.label.length > 20 ? step.label.slice(0, 19) + "…" : step.label}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                      isDone ? "status-badge-success" : isActive ? "bg-foreground/10 text-foreground" : "status-badge-idle"
                    }`}>
                      {isDone ? "Complete" : isActive ? "Active" : "Idle"}
                    </span>
                  </div>
                  {(isActive || isDone) && (
                    <div className="text-[11px] text-muted-foreground mt-0.5 animate-fade-in">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Vercel-style timeline segment bar */}
        <div className="flex items-center gap-0.5">
          {steps.map((step, i) => {
            const isDone = i < currentStep;
            const isActive = i === currentStep;
            const color = step.type === "signal" ? "hsl(217, 91%, 60%)" :
                         step.type === "incident" ? "hsl(330, 81%, 60%)" :
                         step.type === "condition" ? "hsl(38, 92%, 50%)" :
                         "hsl(142, 71%, 45%)";
            return (
              <div key={i} className="flex-1 flex gap-0.5">
                <div
                  className="flex-1 h-1.5 rounded-full transition-all duration-200"
                  style={{
                    background: isDone || isActive ? color : "hsl(0, 0%, 18%)",
                    opacity: isDone ? 1 : isActive ? 0.7 : 0.3,
                  }}
                />
                {i < steps.length - 1 && (
                  <div
                    className="w-2 h-1.5 rounded-full"
                    style={{
                      background: isDone ? color : "hsl(0, 0%, 18%)",
                      opacity: isDone ? 0.4 : 0.15,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Play button */}
        <button
          onClick={playing ? () => setPlaying(false) : startPlayback}
          className="btn-primary w-full justify-center rounded-lg"
        >
          {playing ? (
            <><Pause className="w-3.5 h-3.5" /> Пауза</>
          ) : currentStep >= steps.length - 1 ? (
            <><RotateCcw className="w-3.5 h-3.5" /> Воспроизвести снова</>
          ) : (
            <><Play className="w-3.5 h-3.5" /> Воспроизвести инцидент</>
          )}
        </button>
      </div>
    </div>
  );
}
