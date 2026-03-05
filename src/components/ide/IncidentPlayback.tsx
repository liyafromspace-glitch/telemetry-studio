import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, CheckCircle, Loader2 } from "lucide-react";
import { type Incident } from "@/data/mockPlatform";
import { StatusBadge } from "@/components/ui/status-badge";
import { SegmentBar } from "@/components/ui/segment-bar";

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

const stepTypeColor = (type: string) => {
  switch (type) {
    case "signal": return "hsl(217, 91%, 60%)";
    case "incident": return "hsl(330, 81%, 60%)";
    case "condition": return "hsl(38, 92%, 50%)";
    default: return "hsl(142, 71%, 45%)";
  }
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
        {/* Vertical timeline steps */}
        <div className="relative">
          <div className="absolute left-[0.55rem] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-0">
            {steps.map((step, i) => {
              const isActive = i === currentStep;
              const isDone = i < currentStep;

              return (
                <div key={i} className="relative pl-7 py-1.5">
                  {/* Dot */}
                  <div className="absolute left-0 top-2.5 flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 z-10 transition-all duration-200 flex items-center justify-center ${
                      isDone ? "bg-success" : isActive ? "bg-foreground" : "bg-muted"
                    }`}>
                      {isDone && <CheckCircle className="w-3 h-3 text-background" />}
                      {isActive && playing && <Loader2 className="w-3 h-3 text-background animate-spin" />}
                    </div>
                  </div>

                  <div className={`transition-all duration-200 ${isActive ? "opacity-100" : isDone ? "opacity-60" : "opacity-30"}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">
                        {step.label.length > 20 ? step.label.slice(0, 19) + "…" : step.label}
                      </span>
                      <StatusBadge
                        variant={isDone ? "success" : isActive ? "neutral" : "idle"}
                        size="xs"
                        dot={false}
                      >
                        {isDone ? "Complete" : isActive ? "Active" : "Idle"}
                      </StatusBadge>
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
        </div>

        {/* Segment bar */}
        <SegmentBar
          segments={steps.map((step, i) => ({
            color: stepTypeColor(step.type),
            active: i <= currentStep,
          }))}
        />

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
