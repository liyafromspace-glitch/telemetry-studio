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
    name: "Преобразование влажности",
    parameterType: "Влажность",
    status: "active",
    version: 3,
    author: "Андреева А.Н.",
    lastCheck: "2024-02-15 14:32",
    reportsUsed: 21,
    parametersLinked: 148,
    errorCount: 0,
    warningCount: 2,
    code: `// Преобразование влажности из относительной в абсолютную
if (input.unit === "%RH") {
    const T = input.temperature || 20;
    const satPressure = 6.112 * Math.exp((17.67 * T) / (T + 243.5));
    output.value = (input.value / 100) * satPressure * 2.1674 / (273.15 + T);
    output.unit = "g/m³";
} else {
    logWarning("Неподдерживаемая единица измерения");
}`,
    createdAt: "2024-01-10",
    category: "Влажность",
  },
  {
    id: "rule-006",
    name: "Удаление выбросов",
    parameterType: "Общее",
    status: "active",
    version: 7,
    author: "Смирнов И.И.",
    lastCheck: "2024-02-15 08:00",
    reportsUsed: 45,
    parametersLinked: 312,
    errorCount: 0,
    warningCount: 1,
    code: `// Удаление выбросов методом IQR
const Q1 = stats.percentile(history, 25);
const Q3 = stats.percentile(history, 75);
const IQR = Q3 - Q1;
const lower = Q1 - 1.5 * IQR;
const upper = Q3 + 1.5 * IQR;

if (input.value < lower || input.value > upper) {
    output.outlier = true;
    output.value = null;
    logWarning("Выброс обнаружен: " + input.value);
} else {
    output.value = input.value;
    output.outlier = false;
}`,
    createdAt: "2023-09-01",
    category: "Влажность",
  },
  {
    id: "rule-002",
    name: "Конвертация температуры",
    parameterType: "Температура",
    status: "active",
    version: 5,
    author: "Петров К.С.",
    lastCheck: "2024-02-14 09:15",
    reportsUsed: 34,
    parametersLinked: 210,
    errorCount: 0,
    warningCount: 0,
    code: `// Преобразование температуры из °C в °F
if (input.unit === "C") {
    output.value = (input.value * 9/5) + 32;
    output.unit = "F";
} else if (input.unit === "K") {
    output.value = (input.value - 273.15) * 9/5 + 32;
    output.unit = "F";
} else {
    logWarning("Неподдерживаемая единица измерения");
}`,
    createdAt: "2023-11-20",
    category: "Температура",
  },
  {
    id: "rule-007",
    name: "Сглаживание сигнала",
    parameterType: "Общее",
    status: "scheduled",
    version: 1,
    author: "Андреева А.Н.",
    lastCheck: "2024-02-12 10:30",
    reportsUsed: 0,
    parametersLinked: 78,
    errorCount: 0,
    warningCount: 0,
    code: `// Экспоненциальное сглаживание сигнала
const alpha = 0.3;
if (!state.previous) {
    state.previous = input.value;
}
output.value = alpha * input.value + (1 - alpha) * state.previous;
state.previous = output.value;`,
    createdAt: "2024-02-10",
    category: "Температура",
  },
  {
    id: "rule-010",
    name: "Контроль перепада температуры",
    parameterType: "Температура",
    status: "error",
    version: 3,
    author: "Андреева А.Н.",
    lastCheck: "2024-02-15 09:30",
    reportsUsed: 15,
    parametersLinked: 67,
    errorCount: 2,
    warningCount: 4,
    code: `// Контроль перепада температуры между датчиками
const delta = Math.abs(input.sensor1 - input.sensor2);
const MAX_DELTA = 15; // °C

if (delta > MAX_DELTA) {
    logError("Критический перепад температуры: " + delta + "°C");
    output.alarm = true;
} else if (delta > MAX_DELTA * 0.8) {
    logWarning("Перепад температуры приближается к критическому");
    output.alarm = false;
}
output.delta = delta;`,
    createdAt: "2024-01-20",
    category: "Температура",
  },
  {
    id: "rule-004",
    name: "Проверка диапазона давления",
    parameterType: "Давление",
    status: "error",
    version: 2,
    author: "Андреева А.Н.",
    lastCheck: "2024-02-15 11:00",
    reportsUsed: 12,
    parametersLinked: 89,
    errorCount: 3,
    warningCount: 5,
    code: `// Проверка допустимого диапазона давления
const MIN_PRESSURE = 0.5; // бар
const MAX_PRESSURE = 350; // бар

if (input.value < MIN_PRESSURE || input.value > MAX_PRESSURE) {
    logError("Значение давления вне допустимого диапазона");
    output.valid = false;
} else {
    output.value = input.value;
    output.valid = true;
}`,
    createdAt: "2024-01-05",
    category: "Давление",
  },
  {
    id: "rule-008",
    name: "Фильтрация отрицательных значений",
    parameterType: "Общее",
    status: "active",
    version: 2,
    author: "Петров К.С.",
    lastCheck: "2024-02-15 13:00",
    reportsUsed: 28,
    parametersLinked: 195,
    errorCount: 0,
    warningCount: 0,
    code: `// Фильтрация отрицательных значений
if (input.value < 0) {
    output.value = 0;
    logWarning("Отрицательное значение заменено на 0");
} else {
    output.value = input.value;
}`,
    createdAt: "2023-10-12",
    category: "Давление",
  },
];

export const categories = [
  "Влажность",
  "Температура",
  "Давление",
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
