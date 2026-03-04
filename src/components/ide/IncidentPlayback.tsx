import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, FastForward } from "lucide-react";
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

const typeColors: Record<string, string> = {
  signal: "border-primary bg-primary/10 text-primary",
  condition: "border-warning bg-warning/10 text-warning",
  function: "border-[hsl(270,50%,60%)] bg-[hsl(270,50%,60%)]/10 text-[hsl(270,50%,60%)]",
  matrix: "border-warning bg-warning/10 text-warning",
  incident: "border-destructive bg-destructive/10 text-destructive",
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
    <div className="ide-panel-glow rounded-sm">
      <div className="ide-header flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Play className="w-3 h-3 text-primary" />
          Воспроизведение инцидента
        </span>
        <div className="flex items-center gap-1 normal-case tracking-normal">
          <button
            onClick={reset}
            className="p-1 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <button
            onClick={() => setSpeed(speed === 1 ? 2 : speed === 2 ? 4 : 1)}
            className="px-1.5 py-0.5 rounded-sm text-[9px] font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            {speed}x
          </button>
        </div>
      </div>

      <div className="p-3">
        {/* Playback visualization */}
        <div className="flex items-center gap-0.5 mb-3 overflow-x-auto pb-1">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-0.5">
              <div
                className={`relative px-2.5 py-1.5 rounded-sm text-[10px] font-medium border transition-all duration-220 ${
                  i <= currentStep
                    ? typeColors[step.type]
                    : "border-border bg-secondary text-muted-foreground"
                } ${i === currentStep ? "shadow-[0_0_12px_hsl(var(--primary)/0.2)] scale-105" : ""}`}
              >
                {step.label.length > 16 ? step.label.slice(0, 15) + "…" : step.label}
                {/* Flow animation dot */}
                {i === currentStep && playing && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-ripple" />
                )}
              </div>
              {i < steps.length - 1 && (
                <span
                  className={`text-[10px] transition-all duration-220 ${
                    i < currentStep ? "text-primary" : "text-muted-foreground/30"
                  }`}
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Current step detail */}
        {currentStep >= 0 && currentStep < steps.length && (
          <div className="glass-controls rounded-md px-3 py-2 mb-3 animate-fade-in">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-[10px] text-muted-foreground">
                Шаг {currentStep + 1}/{steps.length}
              </span>
              <span className="text-foreground font-medium">{steps[currentStep].label}</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {steps[currentStep].description}
            </div>
          </div>
        )}

        {/* Play button */}
        <button
          onClick={playing ? () => setPlaying(false) : startPlayback}
          className="btn-primary w-full justify-center"
        >
          {playing ? (
            <>
              <Pause className="w-3.5 h-3.5" /> Пауза
            </>
          ) : currentStep >= steps.length - 1 ? (
            <>
              <RotateCcw className="w-3.5 h-3.5" /> Воспроизвести снова
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" /> Воспроизвести инцидент
            </>
          )}
        </button>
      </div>
    </div>
  );
}
