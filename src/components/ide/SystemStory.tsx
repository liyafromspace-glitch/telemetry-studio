import { useState } from "react";
import { BookOpen, Activity, Zap, XCircle, Clock, CheckCircle } from "lucide-react";
import { type Incident } from "@/data/mockPlatform";
import { TimelineList, type TimelineItem } from "@/components/ui/timeline-list";
import { StatusBadge } from "@/components/ui/status-badge";

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

const severityToDotColor: Record<string, TimelineItem["dotColor"]> = {
  info: "primary",
  warning: "warning",
  critical: "destructive",
  success: "success",
};

const typeIcons: Record<string, React.ReactNode> = {
  signal: <Activity className="w-3 h-3" />,
  condition: <Zap className="w-3 h-3" />,
  function: <Zap className="w-3 h-3" />,
  matrix: <Zap className="w-3 h-3" />,
  incident: <XCircle className="w-3 h-3" />,
  action: <Clock className="w-3 h-3" />,
  resolved: <CheckCircle className="w-3 h-3" />,
};

export function SystemStory({ incident }: SystemStoryProps) {
  const events = storyByIncident[incident.id] || defaultStory;

  const items: TimelineItem[] = events.map((event, i) => ({
    id: `event-${i}`,
    label: event.time,
    title: event.title,
    description: event.detail,
    dotColor: severityToDotColor[event.severity],
    icon: typeIcons[event.type],
  }));

  return (
    <TimelineList
      title="Хронология системы"
      headerIcon={<BookOpen className="w-3.5 h-3.5" />}
      items={items}
      expandable
    />
  );
}
