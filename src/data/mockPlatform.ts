// Shared platform data: incidents, reports, live signals, context, users

export type AppState = "live" | "investigate" | "analyze" | "configure" | "govern";

export interface PlatformContext {
  environment: string;
  reservoir: string;
  measurementSystem: string;
  period: string;
}

export const defaultContext: PlatformContext = {
  environment: "Северное месторождение",
  reservoir: "РВ-12",
  measurementSystem: "TI03025",
  period: "01.04.2022 – 10.04.2022",
};

// ─── Live Signals ───

export interface LiveSignal {
  id: string;
  parameter: string;
  currentValue: string;
  expectedValue: string;
  unit: string;
  status: "critical" | "warning" | "normal";
  linkedFunction: string;
  linkedMatrix: string;
  timestamp: string;
}

export const liveSignals: LiveSignal[] = [
  {
    id: "sig-001",
    parameter: "TI03025.PV",
    currentValue: "—",
    expectedValue: "85.2",
    unit: "°C",
    status: "critical",
    linkedFunction: "Конвертация температуры",
    linkedMatrix: "Матрица зависимостей СИ",
    timestamp: "2024-02-15 14:32:01",
  },
  {
    id: "sig-002",
    parameter: "PT02012.PV",
    currentValue: "412.8",
    expectedValue: "< 350",
    unit: "бар",
    status: "critical",
    linkedFunction: "Проверка диапазона давления",
    linkedMatrix: "Матрица диапазонов давления",
    timestamp: "2024-02-15 14:31:45",
  },
  {
    id: "sig-003",
    parameter: "FT01007.PV",
    currentValue: "1247.3",
    expectedValue: "800–1100",
    unit: "м³/ч",
    status: "warning",
    linkedFunction: "Пересчет расхода",
    linkedMatrix: "Матрица управляющих механизмов",
    timestamp: "2024-02-15 14:30:12",
  },
  {
    id: "sig-004",
    parameter: "LT04001.PV",
    currentValue: "4.21",
    expectedValue: "4.00–5.00",
    unit: "м",
    status: "normal",
    linkedFunction: "Нормализация уровня нефти",
    linkedMatrix: "Матрица соответствия параметров",
    timestamp: "2024-02-15 14:32:05",
  },
  {
    id: "sig-005",
    parameter: "DT05003.PV",
    currentValue: "842.1",
    expectedValue: "830–850",
    unit: "кг/м³",
    status: "normal",
    linkedFunction: "Коррекция плотности",
    linkedMatrix: "Матрица показателей плотности",
    timestamp: "2024-02-15 14:31:58",
  },
  {
    id: "sig-006",
    parameter: "HT06002.PV",
    currentValue: "98.7",
    expectedValue: "< 95",
    unit: "%RH",
    status: "warning",
    linkedFunction: "Преобразование влажности",
    linkedMatrix: "Матрица соответствия параметров",
    timestamp: "2024-02-15 14:31:30",
  },
];

// ─── Incidents ───

export type IncidentStatus = "new" | "in_progress" | "monitoring" | "resolved";

export interface IncidentTask {
  id: string;
  title: string;
  assignee: string;
  done: boolean;
}

export interface Incident {
  id: string;
  code: string;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: "critical" | "high" | "medium" | "low";
  linkedParameters: string[];
  linkedReports: string[];
  linkedFunctions: string[];
  linkedMatrices: string[];
  createdAt: string;
  updatedAt: string;
  author: string;
  assignee: string;
  tasks: IncidentTask[];
  history: { date: string; action: string; user: string }[];
}

export const incidentStatusLabels: Record<IncidentStatus, string> = {
  new: "Новый",
  in_progress: "В работе",
  monitoring: "На контроле",
  resolved: "Решён",
};

export const incidents: Incident[] = [
  {
    id: "inc-001",
    code: "INC-2989",
    title: "Потеря сигнала TI03025",
    description: "Датчик температуры TI03025 перестал передавать данные. Последнее значение зафиксировано в 14:32. Возможная причина — обрыв линии связи или неисправность преобразователя.",
    status: "in_progress",
    priority: "critical",
    linkedParameters: ["TI03025.PV", "TI03025.STATUS"],
    linkedReports: ["Состояние СИ за период", "Динамика температуры"],
    linkedFunctions: ["Конвертация температуры", "Контроль перепада температуры"],
    linkedMatrices: ["Матрица зависимостей СИ"],
    createdAt: "2024-02-15 14:35",
    updatedAt: "2024-02-15 15:10",
    author: "Система",
    assignee: "Петров К.С.",
    tasks: [
      { id: "t1", title: "Проверить линию связи до TI03025", assignee: "Петров К.С.", done: true },
      { id: "t2", title: "Заменить преобразователь при необходимости", assignee: "Смирнов И.И.", done: false },
      { id: "t3", title: "Проверить связанные отчёты", assignee: "Андреева А.Н.", done: false },
    ],
    history: [
      { date: "2024-02-15 14:35", action: "Инцидент создан автоматически", user: "Система" },
      { date: "2024-02-15 14:40", action: "Назначен Петров К.С.", user: "Андреева А.Н." },
      { date: "2024-02-15 15:10", action: "Линия связи проверена — обрыв на участке Б", user: "Петров К.С." },
    ],
  },
  {
    id: "inc-002",
    code: "INC-3012",
    title: "Аномальный расход FT01007",
    description: "Зафиксировано превышение допустимого диапазона расхода на линии FT01007. Значение 1247.3 м³/ч при норме 800–1100 м³/ч.",
    status: "new",
    priority: "high",
    linkedParameters: ["FT01007.PV"],
    linkedReports: ["Надежность по резервуарам"],
    linkedFunctions: ["Пересчет расхода", "Удаление выбросов"],
    linkedMatrices: ["Матрица управляющих механизмов"],
    createdAt: "2024-02-15 14:30",
    updatedAt: "2024-02-15 14:30",
    author: "Система",
    assignee: "",
    tasks: [],
    history: [
      { date: "2024-02-15 14:30", action: "Инцидент создан автоматически", user: "Система" },
    ],
  },
  {
    id: "inc-003",
    code: "INC-2950",
    title: "Превышение диапазона давления PT02012",
    description: "Давление на участке PT02012 достигло 412.8 бар при максимально допустимом 350 бар. Требуется немедленная проверка.",
    status: "monitoring",
    priority: "critical",
    linkedParameters: ["PT02012.PV", "PT02012.HI"],
    linkedReports: ["Состояние СИ за период"],
    linkedFunctions: ["Проверка диапазона давления"],
    linkedMatrices: ["Матрица диапазонов давления"],
    createdAt: "2024-02-14 09:15",
    updatedAt: "2024-02-15 11:00",
    author: "Система",
    assignee: "Смирнов И.И.",
    tasks: [
      { id: "t1", title: "Проверить калибровку манометра", assignee: "Смирнов И.И.", done: true },
      { id: "t2", title: "Скорректировать допустимый диапазон", assignee: "Андреева А.Н.", done: true },
    ],
    history: [
      { date: "2024-02-14 09:15", action: "Инцидент создан автоматически", user: "Система" },
      { date: "2024-02-14 10:00", action: "Назначен Смирнов И.И.", user: "Петров К.С." },
      { date: "2024-02-14 16:30", action: "Калибровка проверена — в норме", user: "Смирнов И.И." },
      { date: "2024-02-15 11:00", action: "Диапазон скорректирован до 200–250 бар", user: "Андреева А.Н." },
    ],
  },
  {
    id: "inc-004",
    code: "INC-2870",
    title: "Нестабильный сигнал влажности HT06002",
    description: "Датчик влажности HT06002 показывает значения выше допустимого порога 95%RH.",
    status: "resolved",
    priority: "medium",
    linkedParameters: ["HT06002.PV"],
    linkedReports: ["Частота инцидентов"],
    linkedFunctions: ["Преобразование влажности"],
    linkedMatrices: ["Матрица соответствия параметров"],
    createdAt: "2024-02-10 08:00",
    updatedAt: "2024-02-12 16:00",
    author: "Андреева А.Н.",
    assignee: "Петров К.С.",
    tasks: [
      { id: "t1", title: "Проверить датчик на месте", assignee: "Петров К.С.", done: true },
      { id: "t2", title: "Заменить датчик", assignee: "Петров К.С.", done: true },
    ],
    history: [
      { date: "2024-02-10 08:00", action: "Инцидент создан вручную", user: "Андреева А.Н." },
      { date: "2024-02-11 14:00", action: "Датчик проверен — подтверждена деградация", user: "Петров К.С." },
      { date: "2024-02-12 16:00", action: "Датчик заменён, сигнал стабилизирован", user: "Петров К.С." },
    ],
  },
];

// ─── Reports ───

export interface Report {
  id: string;
  name: string;
  description: string;
  linkedParameters: string[];
  linkedFunctions: string[];
  linkedMatrices: string[];
  lastGenerated: string;
  period: string;
}

export const reports: Report[] = [
  {
    id: "rep-001",
    name: "Состояние СИ за период",
    description: "Комплексный отчёт о состоянии систем измерения за выбранный период. Включает данные по всем активным датчикам.",
    linkedParameters: ["TI03025.PV", "PT02012.PV", "FT01007.PV", "LT04001.PV"],
    linkedFunctions: ["Конвертация температуры", "Проверка диапазона давления"],
    linkedMatrices: ["Матрица зависимостей СИ", "Матрица соответствия параметров"],
    lastGenerated: "2024-02-15 06:00",
    period: "01.04.2022 – 10.04.2022",
  },
  {
    id: "rep-002",
    name: "Надежность по резервуарам",
    description: "Анализ надёжности оборудования в разрезе резервуаров. Включает статистику отказов и время наработки.",
    linkedParameters: ["FT01007.PV", "LT04001.PV"],
    linkedFunctions: ["Пересчет расхода", "Нормализация уровня нефти"],
    linkedMatrices: ["Матрица управляющих механизмов"],
    lastGenerated: "2024-02-14 06:00",
    period: "01.04.2022 – 10.04.2022",
  },
  {
    id: "rep-003",
    name: "Частота инцидентов",
    description: "Статистика инцидентов по категориям и приоритетам за выбранный период.",
    linkedParameters: ["HT06002.PV", "PT02012.PV"],
    linkedFunctions: ["Удаление выбросов", "Фильтрация отрицательных значений"],
    linkedMatrices: ["Матрица диапазонов давления"],
    lastGenerated: "2024-02-15 08:00",
    period: "01.04.2022 – 10.04.2022",
  },
  {
    id: "rep-004",
    name: "Динамика температуры",
    description: "Трендовый анализ температурных параметров с визуализацией отклонений от нормы.",
    linkedParameters: ["TI03025.PV", "DT05003.PV"],
    linkedFunctions: ["Конвертация температуры", "Контроль перепада температуры", "Сглаживание сигнала"],
    linkedMatrices: ["Матрица зависимостей СИ", "Матрица показателей плотности"],
    lastGenerated: "2024-02-15 06:00",
    period: "01.04.2022 – 10.04.2022",
  },
];

// ─── Version Audit Log ───

export interface VersionAuditEntry {
  id: string;
  entityType: "function" | "matrix";
  entityName: string;
  fromVersion: number;
  toVersion: number;
  changeDescription: string;
  impactParameters: number;
  impactFunctions: number;
  impactReports: number;
  activatedBy: string;
  activatedAt: string;
}

export const versionAuditLog: VersionAuditEntry[] = [
  {
    id: "va-001",
    entityType: "matrix",
    entityName: "Матрица диапазонов давления",
    fromVersion: 3,
    toVersion: 4,
    changeDescription: "Изменено: допустимое отклонение 200 → 250 бар на участке Б",
    impactParameters: 148,
    impactFunctions: 4,
    impactReports: 12,
    activatedBy: "Андреева А.Н.",
    activatedAt: "2024-02-15 11:30",
  },
  {
    id: "va-002",
    entityType: "function",
    entityName: "Конвертация температуры",
    fromVersion: 4,
    toVersion: 5,
    changeDescription: "Добавлена поддержка конвертации из Кельвинов",
    impactParameters: 210,
    impactFunctions: 2,
    impactReports: 34,
    activatedBy: "Петров К.С.",
    activatedAt: "2024-02-14 10:15",
  },
  {
    id: "va-003",
    entityType: "function",
    entityName: "Удаление выбросов",
    fromVersion: 6,
    toVersion: 7,
    changeDescription: "Увеличен множитель IQR с 1.5 до 2.0 для снижения ложных срабатываний",
    impactParameters: 312,
    impactFunctions: 3,
    impactReports: 45,
    activatedBy: "Смирнов И.И.",
    activatedAt: "2024-02-13 16:00",
  },
  {
    id: "va-004",
    entityType: "matrix",
    entityName: "Матрица управляющих механизмов",
    fromVersion: 4,
    toVersion: 5,
    changeDescription: "Добавлена связь Насос Н-02 → Расходомер #3",
    impactParameters: 52,
    impactFunctions: 5,
    impactReports: 14,
    activatedBy: "Смирнов И.И.",
    activatedAt: "2024-02-12 09:00",
  },
  {
    id: "va-005",
    entityType: "function",
    entityName: "Коррекция плотности",
    fromVersion: 3,
    toVersion: 4,
    changeDescription: "Обновлён коэффициент объёмного расширения beta: 0.000600 → 0.000612",
    impactParameters: 134,
    impactFunctions: 1,
    impactReports: 18,
    activatedBy: "Петров К.С.",
    activatedAt: "2024-02-11 14:30",
  },
  {
    id: "va-006",
    entityType: "matrix",
    entityName: "Матрица соответствия параметров",
    fromVersion: 5,
    toVersion: 6,
    changeDescription: "Обновлены калибровочные данные для эталонов T-001, P-001",
    impactParameters: 95,
    impactFunctions: 6,
    impactReports: 18,
    activatedBy: "Андреева А.Н.",
    activatedAt: "2024-02-10 08:45",
  },
];
