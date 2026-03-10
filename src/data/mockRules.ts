export type RuleStatus = "active" | "draft" | "error" | "scheduled";

export interface Rule {
  id: string;
  name: string;
  parameterType: string;
  status: RuleStatus;
  version: number;
  author: string;
  lastCheck: string;
  reportsUsed: number;
  parametersLinked: number;
  errorCount: number;
  warningCount: number;
  code: string;
  createdAt: string;
  category: string;
}

export const rules: Rule[] = [
  {
    id: "rule-001",
    name: "Контроль перегрева",
    parameterType: "Температура",
    status: "active",
    version: 3,
    author: "Андреева А.Н.",
    lastCheck: "2026-03-10 09:34",
    reportsUsed: 4,
    parametersLinked: 12,
    errorCount: 0,
    warningCount: 1,
    code: `// Контроль перегрева резервуара
const TEMP_THRESHOLD = 90; // °C
const PRESSURE_THRESHOLD = 11; // бар

if (input.temperature > TEMP_THRESHOLD
    && input.pressure > PRESSURE_THRESHOLD) {
    activateFunction("Контроль перегрева");
    closeValve("XV-R12-01");
    createIncident("Перегрев резервуара");
    logError("Температура " + input.temperature + "°C > " + TEMP_THRESHOLD + "°C");
} else if (input.temperature > TEMP_THRESHOLD * 0.95) {
    logWarning("Приближение к порогу перегрева");
}`,
    createdAt: "2025-11-10",
    category: "Температура",
  },
  {
    id: "rule-002",
    name: "Контроль давления линии",
    parameterType: "Давление",
    status: "active",
    version: 5,
    author: "Петров К.С.",
    lastCheck: "2026-03-10 09:33",
    reportsUsed: 3,
    parametersLinked: 6,
    errorCount: 0,
    warningCount: 1,
    code: `// Контроль давления линии подачи
const MIN_PRESSURE = 2; // бар
const MAX_PRESSURE = 11; // бар

if (input.pressure > MAX_PRESSURE) {
    logWarning("Давление " + input.pressure + " бар > " + MAX_PRESSURE);
    output.alarm = "high_pressure";
} else if (input.pressure < MIN_PRESSURE) {
    logError("Давление ниже минимума");
    output.alarm = "low_pressure";
} else {
    output.valid = true;
}`,
    createdAt: "2025-08-20",
    category: "Давление",
  },
  {
    id: "rule-003",
    name: "Мониторинг насоса",
    parameterType: "Скорость",
    status: "active",
    version: 2,
    author: "Смирнов И.И.",
    lastCheck: "2026-03-10 09:34",
    reportsUsed: 2,
    parametersLinked: 4,
    errorCount: 0,
    warningCount: 0,
    code: `// Мониторинг скорости насоса
const MAX_RPM = 1500;
const RAMP_LIMIT = 200; // RPM/с

if (input.speed > MAX_RPM) {
    logError("Превышение скорости: " + input.speed + " RPM");
    output.alarm = true;
}
if (input.rampRate > RAMP_LIMIT) {
    logWarning("Скорость нарастания > " + RAMP_LIMIT + " RPM/с");
}
output.speed = input.speed;`,
    createdAt: "2025-12-01",
    category: "Скорость",
  },
  {
    id: "rule-004",
    name: "Контроль уровня топлива",
    parameterType: "Уровень",
    status: "active",
    version: 2,
    author: "Петров К.С.",
    lastCheck: "2026-03-10 09:34",
    reportsUsed: 2,
    parametersLinked: 3,
    errorCount: 0,
    warningCount: 0,
    code: `// Контроль уровня топлива
const MIN_LEVEL = 20; // %
const LOW_LEVEL = 60; // %

if (input.level < MIN_LEVEL) {
    logError("Критически низкий уровень: " + input.level + "%");
    output.alarm = "critical_low";
} else if (input.level < LOW_LEVEL) {
    logWarning("Низкий уровень: " + input.level + "%");
    output.alarm = "low";
} else {
    output.valid = true;
}`,
    createdAt: "2025-10-12",
    category: "Уровень",
  },
  {
    id: "rule-005",
    name: "Управление клапаном подачи",
    parameterType: "Клапан",
    status: "active",
    version: 3,
    author: "Андреева А.Н.",
    lastCheck: "2026-03-10 09:35",
    reportsUsed: 2,
    parametersLinked: 5,
    errorCount: 0,
    warningCount: 0,
    code: `// Управление клапаном подачи
if (input.command === "CLOSE") {
    setValveState("XV-R12-01", "ЗАКРЫТ");
    logInfo("Клапан закрыт по команде");
} else if (input.command === "OPEN") {
    if (input.safetyCheck === true) {
        setValveState("XV-R12-01", "ОТКРЫТ");
    } else {
        logError("Открытие заблокировано: не пройдена проверка");
    }
}`,
    createdAt: "2025-09-01",
    category: "Клапан",
  },
  {
    id: "rule-006",
    name: "Корреляция температура–давление",
    parameterType: "Температура",
    status: "draft",
    version: 1,
    author: "Андреева А.Н.",
    lastCheck: "2026-03-10 09:40",
    reportsUsed: 1,
    parametersLinked: 8,
    errorCount: 0,
    warningCount: 2,
    code: `// Кросс-корреляция: температура ↔ давление
const correlation = stats.pearson(
    history.get("TI-R12-01.PV", "1h"),
    history.get("PI-R12-01.PV", "1h")
);

if (correlation > 0.8) {
    logInfo("Высокая корреляция: " + correlation.toFixed(2));
    output.correlated = true;
}
output.coefficient = correlation;`,
    createdAt: "2026-03-10",
    category: "Температура",
  },
  {
    id: "rule-007",
    name: "Детектор аномалий температуры",
    parameterType: "Температура",
    status: "error",
    version: 2,
    author: "Смирнов И.И.",
    lastCheck: "2026-03-10 09:34",
    reportsUsed: 3,
    parametersLinked: 6,
    errorCount: 2,
    warningCount: 3,
    code: `// Детектор аномалий методом скользящего среднего
const window = history.last(10);
const avg = stats.mean(window);
const std = stats.stddev(window);
const SIGMA = 2;

if (Math.abs(input.value - avg) > SIGMA * std) {
    logError("Аномалия: " + input.value + " при среднем " + avg.toFixed(1));
    output.anomaly = true;
    output.deviation = (input.value - avg) / std;
} else {
    output.anomaly = false;
}`,
    createdAt: "2026-01-15",
    category: "Температура",
  },
];

export const categories = [
  "Температура",
  "Давление",
  "Скорость",
  "Уровень",
  "Клапан",
] as const;

export const statusLabels: Record<RuleStatus, string> = {
  active: "Активно",
  draft: "Черновик",
  error: "Ошибка",
  scheduled: "Запланировано",
};

export const statusColors: Record<RuleStatus, string> = {
  active: "status-active",
  draft: "status-draft",
  error: "status-error",
  scheduled: "status-scheduled",
};
