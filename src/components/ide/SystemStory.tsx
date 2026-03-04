import { useState } from "react";
import { BookOpen, ChevronRight, AlertTriangle, XCircle, CheckCircle, Clock, Zap, Activity } from "lucide-react";
import { type Incident } from "@/data/mockPlatform";

interface SystemStoryProps {
  incident: Incident;
}

interface StoryEvent {
  time: string;
  type: "signal" | "condition" | "function" | "matrix" | "incident" | "action" | "resolved";
  title: string;
  detail: string;
  severity: "info" | "warning" | "critical" | "success";
}

const storyByIncident: Record<string, StoryEvent[]> = {
  "inc-001": [
    { time: "14:30", type: "signal", title: "Температура стабильна", detail: "TI03025.PV = 85.2°C, в пределах нормы", severity: "info" },
    { time: "14:31", type: "signal", title: "Значение не обновляется", detail: "TI03025.PV не получает новых данных уже 60 секунд", severity: "warning" },
    { time: "14:32", type: "condition", title: "Условие потери сигнала", detail: "Timeout > 60s → TRUE. Последнее значение: 85.2°C", severity: "warning" },
    { time: "14:33", type: "function", title: "Функция «Конвертация температуры»", detail: "Вход: null. Результат: ошибка — нет данных", severity: "critical" },
    { time: "14:34", type: "matrix", title: "Матрица зависимостей СИ", detail: "Статус TI03025 обновлён на «Потеря сигнала»", severity: "critical" },
    { time: "14:35", type: "incident", title: "Инцидент INC-2989 создан", detail: "Автоматическое создание: потеря сигнала TI03025", severity: "critical" },
    { time: "14:40", type: "action", title: "Назначен Петров К.С.", detail: "Андреева А.Н. назначила ответственного", severity: "info" },
    { time: "15:10", type: "action", title: "Обрыв линии связи обнаружен", detail: "Участок Б — физическое повреждение кабеля", severity: "warning" },
  ],
  "inc-002": [
    { time: "14:25", type: "signal", title: "Расход в норме", detail: "FT01007.PV = 1050 м³/ч", severity: "info" },
    { time: "14:28", type: "signal", title: "Расход растёт", detail: "FT01007.PV = 1180 м³/ч, приближается к верхней границе", severity: "warning" },
    { time: "14:29", type: "condition", title: "Превышение диапазона", detail: "FT01007.PV = 1247.3 > 1100 → TRUE", severity: "critical" },
    { time: "14:30", type: "function", title: "Функция «Пересчет расхода»", detail: "Выброс обнаружен. Значение помечено как аномальное", severity: "critical" },
    { time: "14:30", type: "incident", title: "Инцидент INC-3012 создан", detail: "Автоматическое создание: аномальный расход", severity: "critical" },
  ],
  "inc-003": [
    { time: "09:00", type: "signal", title: "Давление стабильно", detail: "PT02012.PV = 340 бар", severity: "info" },
    { time: "09:10", type: "signal", title: "Давление растёт", detail: "PT02012.PV = 370 бар", severity: "warning" },
    { time: "09:15", type: "condition", title: "Превышение порога", detail: "PT02012.PV = 412.8 > 350 → TRUE", severity: "critical" },
    { time: "09:15", type: "incident", title: "Инцидент INC-2950 создан", detail: "Превышение допустимого давления", severity: "critical" },
    { time: "10:00", type: "action", title: "Назначен Смирнов И.И.", detail: "Петров К.С. назначил ответственного", severity: "info" },
    { time: "16:30", type: "action", title: "Калибровка в норме", detail: "Манометр проверен — данные корректны", severity: "info" },
    { time: "11:00", type: "resolved", title: "Диапазон скорректирован", detail: "Новый допустимый диапазон: 200–250 бар", severity: "success" },
  ],
};

const defaultStory: StoryEvent[] = [
  { time: "—", type: "signal", title: "Событие зафиксировано", detail: "Системное событие", severity: "info" },
];

const typeIcons: Record<string, React.ReactNode> = {
  signal: <Activity className="w-3.5 h-3.5" />,
  condition: <Zap className="w-3.5 h-3.5" />,
  function: <Zap className="w-3.5 h-3.5" />,
  matrix: <Zap className="w-3.5 h-3.5" />,
  incident: <XCircle className="w-3.5 h-3.5" />,
  action: <Clock className="w-3.5 h-3.5" />,
  resolved: <CheckCircle className="w-3.5 h-3.5" />,
};

const severityConnDot: Record<string, string> = {
  info: "bg-conn-blue",
  warning: "bg-conn-orange",
  critical: "bg-conn-pink",
  success: "bg-conn-green",
};

const severityIconColor: Record<string, string> = {
  info: "text-conn-blue",
  warning: "text-conn-orange",
  critical: "text-conn-pink",
  success: "text-conn-green",
};

export function SystemStory({ incident }: SystemStoryProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const events = storyByIncident[incident.id] || defaultStory;

  const toggle = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="vercel-card">
      <div className="ide-header flex items-center gap-1.5">
        <BookOpen className="w-3.5 h-3.5 text-foreground" />
        <span>Хронология системы</span>
      </div>
      <div className="p-3 relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[2.05rem] top-3 bottom-3 w-px bg-border" />

        <div className="space-y-0 stagger-children">
          {events.map((event, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className="w-full text-left relative pl-10 pr-3 py-2.5 rounded-lg transition-all duration-180 hover:bg-muted/50"
            >
              {/* Timeline dot */}
              <div className={`absolute left-[1.55rem] top-3.5 w-2.5 h-2.5 rounded-full z-10 transition-all duration-200 ${severityConnDot[event.severity]}`} />

              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-[10px] text-muted-foreground w-10">{event.time}</span>
                <span className={severityIconColor[event.severity]}>{typeIcons[event.type]}</span>
                <span className="text-foreground font-medium flex-1">{event.title}</span>
                <ChevronRight className={`w-3 h-3 text-muted-foreground transition-transform duration-150 ${expanded.has(i) ? "rotate-90" : ""}`} />
              </div>

              {expanded.has(i) && (
                <div className="mt-1.5 ml-12 text-[11px] text-muted-foreground animate-fade-in leading-relaxed">
                  {event.detail}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
