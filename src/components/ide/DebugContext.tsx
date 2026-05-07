import { createContext, useContext, useState, ReactNode } from "react";

export interface SignalSnapshot {
  signal: string;
  value: string;
  threshold?: string;
  timestamp: string;
  status: "ok" | "warning" | "error";
  /** Tokens to highlight in rule code (e.g. "temperature", "pressure") */
  codeTokens: string[];
}

/** Map between Russian signal labels / codes and code identifiers in rules */
export const signalRegistry: Record<string, SignalSnapshot> = {
  "TI-R12-01": {
    signal: "TI-R12-01.PV",
    value: "96°C",
    threshold: "90°C",
    timestamp: "09:34:00",
    status: "error",
    codeTokens: ["temperature", "TEMP_THRESHOLD", "Температура"],
  },
  "PI-R12-01": {
    signal: "PI-R12-01.PV",
    value: "12.3 бар",
    threshold: "11 бар",
    timestamp: "09:33:55",
    status: "warning",
    codeTokens: ["pressure", "PRESSURE_THRESHOLD", "MAX_PRESSURE", "Давление"],
  },
  "SI-R12-01": {
    signal: "SI-R12-01.PV",
    value: "1450 RPM",
    threshold: "1500 RPM",
    timestamp: "09:36:00",
    status: "ok",
    codeTokens: ["speed", "MAX_RPM", "rampRate", "Скорость"],
  },
  "XV-R12-01": {
    signal: "XV-R12-01",
    value: "ЗАКРЫТ",
    timestamp: "09:34:02",
    status: "ok",
    codeTokens: ["closeValve", "setValveState", "XV-R12-01", "Клапан"],
  },
};

interface DebugContextValue {
  highlightedSignal: string | null;
  setHighlightedSignal: (s: string | null) => void;
  showCausal: boolean;
  setShowCausal: (v: boolean) => void;
}

const Ctx = createContext<DebugContextValue | null>(null);

export function DebugProvider({ children }: { children: ReactNode }) {
  const [highlightedSignal, setHighlightedSignal] = useState<string | null>(null);
  const [showCausal, setShowCausal] = useState(false);
  return (
    <Ctx.Provider value={{ highlightedSignal, setHighlightedSignal, showCausal, setShowCausal }}>
      {children}
    </Ctx.Provider>
  );
}

export function useDebug() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDebug must be used inside DebugProvider");
  return v;
}

export function getSnapshot(key: string | null): SignalSnapshot | null {
  if (!key) return null;
  // Try direct, else search by partial match
  if (signalRegistry[key]) return signalRegistry[key];
  const found = Object.entries(signalRegistry).find(
    ([k, v]) => key.includes(k) || v.codeTokens.some((t) => key.toLowerCase().includes(t.toLowerCase()))
  );
  return found ? found[1] : null;
}
