import { useCallback, useState } from "react";

export type IntelligenceItemSeverity = "critical" | "high" | "medium" | "low";
export type IntelligenceItemStatus =
  | "active"
  | "monitoring"
  | "acknowledged"
  | "resolved";
export type IntelligenceItemSource =
  | "incident"
  | "signal"
  | "rule"
  | "matrix"
  | "asset";

export interface IntelligenceEvidence {
  id: string;
  label: string;
  value: string;
  sourceType: IntelligenceItemSource;
  sourceId: string;
}

export interface IntelligenceItem {
  id: string;
  title: string;
  severity: IntelligenceItemSeverity;
  status: IntelligenceItemStatus;
  sourceType: IntelligenceItemSource;
  sourceId: string;
  assetId: string;
  assetName: string;
  confidence: number;
  aiReason: string;
  recommendedAction: string;
  whyItMatters: string;
  predictedRisk?: string;
  updatedAt: string;
  evidence: IntelligenceEvidence[];
}

const seed: IntelligenceItem[] = [
  {
    id: "ai-001",
    title: "Reservoir-12 overheating risk",
    severity: "critical",
    status: "active",
    sourceType: "incident",
    sourceId: "INC-4201",
    assetId: "asset-r12",
    assetName: "Reservoir-12",
    confidence: 84,
    aiReason:
      "Temperature exceeded threshold and correlates with abnormal pressure rise.",
    recommendedAction:
      "Inspect cooling valve XV-R12-01 and keep Reservoir-12 under active monitoring.",
    whyItMatters: "Continued drift may trigger emergency protection matrix.",
    predictedRisk:
      "Potential shutdown within 30–45 minutes if trend continues.",
    updatedAt: "just now",
    evidence: [
      { id: "e1", label: "TI-R12-01.PV", value: "96.4 °C", sourceType: "signal", sourceId: "sig-001" },
      { id: "e2", label: "Threshold", value: "< 90 °C", sourceType: "rule", sourceId: "rule-overheat" },
      { id: "e3", label: "PI-R12-01.PV", value: "12.3 bar", sourceType: "signal", sourceId: "sig-002" },
      { id: "e4", label: "Rule", value: "Overheat control", sourceType: "rule", sourceId: "rule-overheat" },
      { id: "e5", label: "Matrix", value: "Emergency protection matrix", sourceType: "matrix", sourceId: "mx-emergency" },
    ],
  },
  {
    id: "ai-002",
    title: "Pressure deviation may be secondary effect",
    severity: "high",
    status: "active",
    sourceType: "signal",
    sourceId: "sig-002",
    assetId: "asset-r12",
    assetName: "Reservoir-12",
    confidence: 71,
    aiReason:
      "Pressure rise on PI-R12-01 follows temperature drift with ~90s lag, suggesting it is a downstream effect rather than an independent fault.",
    recommendedAction:
      "Compare pressure trend with temperature rise before changing pressure threshold.",
    whyItMatters:
      "Adjusting the pressure rule prematurely could mask the underlying thermal issue.",
    predictedRisk: "Risk of misclassifying root cause if treated in isolation.",
    updatedAt: "just now",
    evidence: [
      { id: "e1", label: "PI-R12-01.PV", value: "12.3 bar", sourceType: "signal", sourceId: "sig-002" },
      { id: "e2", label: "Expected", value: "8–11 bar", sourceType: "rule", sourceId: "rule-pressure" },
      { id: "e3", label: "TI-R12-01.PV", value: "96.4 °C", sourceType: "signal", sourceId: "sig-001" },
    ],
  },
  {
    id: "ai-003",
    title: "Rule sensitivity needs review",
    severity: "medium",
    status: "active",
    sourceType: "rule",
    sourceId: "rule-overheat",
    assetId: "asset-r12",
    assetName: "Reservoir-12",
    confidence: 66,
    aiReason:
      "Overheat rule has triggered 4 times this week with similar correlation patterns, indicating threshold may be too tight for current operating regime.",
    recommendedAction:
      "Review overheat threshold after incident is stabilized.",
    whyItMatters:
      "Repeated firings reduce operator trust and risk alarm fatigue.",
    updatedAt: "just now",
    evidence: [
      { id: "e1", label: "Rule", value: "Overheat control", sourceType: "rule", sourceId: "rule-overheat" },
      { id: "e2", label: "Firings (7d)", value: "4", sourceType: "rule", sourceId: "rule-overheat" },
      { id: "e3", label: "Threshold", value: "90 °C", sourceType: "rule", sourceId: "rule-overheat" },
    ],
  },
];

export function useOperationalIntelligence() {
  const [items, setItems] = useState<IntelligenceItem[]>(seed);

  const setStatus = useCallback(
    (id: string, status: IntelligenceItemStatus) => {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status } : it))
      );
    },
    []
  );

  const acknowledgeAll = useCallback(() => {
    setItems((prev) =>
      prev.map((it) =>
        it.status === "active" ? { ...it, status: "acknowledged" } : it
      )
    );
  }, []);

  const counts = {
    critical: items.filter((i) => i.severity === "critical").length,
    high: items.filter((i) => i.severity === "high").length,
    medium: items.filter((i) => i.severity === "medium").length,
    low: items.filter((i) => i.severity === "low").length,
  };
  const avgConfidence = items.length
    ? Math.round(items.reduce((s, i) => s + i.confidence, 0) / items.length)
    : 0;

  return { items, counts, avgConfidence, setStatus, acknowledgeAll };
}
