// Asset Management mock data — buildings → floors → systems → equipment → devices → signals
// Plus a relationship graph (feeds, controls, measures, depends_on, located_in).

export type AssetKind =
  | "building"
  | "floor"
  | "system"
  | "equipment"
  | "device"
  | "signal";

export type AssetHealth = "healthy" | "degraded" | "critical" | "unknown";

export interface Asset {
  id: string;
  name: string;
  kind: AssetKind;
  parentId: string | null;
  health: AssetHealth;
  tags: string[];
  vendor?: string;
  model?: string;
  installedAt?: string;
  lastSeen?: string;
  // Inline AI hints
  aiHints?: string[];
}

export type RelationKind =
  | "feeds"
  | "controls"
  | "measures"
  | "depends_on"
  | "located_in";

export interface AssetRelation {
  id: string;
  from: string;
  to: string;
  kind: RelationKind;
}

export const relationLabels: Record<RelationKind, string> = {
  feeds: "feeds",
  controls: "controls",
  measures: "measures",
  depends_on: "depends on",
  located_in: "located in",
};

export const relationColors: Record<RelationKind, "blue" | "orange" | "pink" | "green"> = {
  feeds: "blue",
  controls: "orange",
  measures: "green",
  depends_on: "pink",
  located_in: "blue",
};

export const assets: Asset[] = [
  // Buildings
  { id: "bld-tower-a", name: "Tower A", kind: "building", parentId: null, health: "degraded", tags: ["HQ", "Class-A"] },
  { id: "bld-tower-b", name: "Tower B", kind: "building", parentId: null, health: "healthy", tags: ["Annex"] },

  // Floors
  { id: "flr-a-bsm", name: "Basement", kind: "floor", parentId: "bld-tower-a", health: "degraded", tags: ["Mech"] },
  { id: "flr-a-1", name: "Floor 1", kind: "floor", parentId: "bld-tower-a", health: "healthy", tags: ["Lobby"] },
  { id: "flr-a-2", name: "Floor 2", kind: "floor", parentId: "bld-tower-a", health: "degraded", tags: ["Office"] },
  { id: "flr-a-3", name: "Floor 3", kind: "floor", parentId: "bld-tower-a", health: "healthy", tags: ["Office"] },
  { id: "flr-a-roof", name: "Rooftop", kind: "floor", parentId: "bld-tower-a", health: "healthy", tags: ["Mech"] },

  // Systems
  { id: "sys-cooling", name: "Cooling System", kind: "system", parentId: "flr-a-bsm", health: "degraded", tags: ["HVAC", "Critical"] },
  { id: "sys-electrical", name: "Electrical", kind: "system", parentId: "flr-a-bsm", health: "healthy", tags: ["Power"] },
  { id: "sys-air-2", name: "Air Distribution F2", kind: "system", parentId: "flr-a-2", health: "degraded", tags: ["HVAC"] },

  // Equipment
  { id: "eq-pump-4", name: "Pump 4", kind: "equipment", parentId: "sys-cooling", health: "degraded", tags: ["Rotating"], vendor: "Grundfos", model: "CR 64-2" },
  { id: "eq-chiller-1", name: "Chiller 1", kind: "equipment", parentId: "sys-cooling", health: "healthy", tags: ["Critical"], vendor: "Carrier", model: "30XA" },
  { id: "eq-ahu-2a", name: "AHU 2A", kind: "equipment", parentId: "sys-air-2", health: "degraded", tags: ["HVAC"], vendor: "Trane", model: "M-Series" },
  { id: "eq-ahu-2b", name: "AHU 2B", kind: "equipment", parentId: "sys-air-2", health: "healthy", tags: ["HVAC"], vendor: "Trane", model: "M-Series" },
  { id: "eq-panel-mdb", name: "Main Distribution Panel", kind: "equipment", parentId: "sys-electrical", health: "healthy", tags: ["Power"] },

  // Devices
  { id: "dev-vfd-pump4", name: "VFD — Pump 4", kind: "device", parentId: "eq-pump-4", health: "degraded", tags: ["Drive"], vendor: "ABB", model: "ACS580", aiHints: ["Topology: VFD missing controller link"] },
  { id: "dev-temp-ahu2a", name: "Temp Sensor — AHU 2A", kind: "device", parentId: "eq-ahu-2a", health: "critical", tags: ["Sensor"], vendor: "Belimo", model: "22DTH" },
  { id: "dev-flow-pump4", name: "Flow Meter — Pump 4", kind: "device", parentId: "eq-pump-4", health: "healthy", tags: ["Sensor"] },
  { id: "dev-press-chiller1", name: "Pressure — Chiller 1", kind: "device", parentId: "eq-chiller-1", health: "healthy", tags: ["Sensor"] },

  // Signals
  { id: "sig-pump4-rpm", name: "Pump 4 / RPM", kind: "signal", parentId: "dev-vfd-pump4", health: "degraded", tags: ["telemetry"] },
  { id: "sig-pump4-flow", name: "Pump 4 / Flow", kind: "signal", parentId: "dev-flow-pump4", health: "healthy", tags: ["telemetry"] },
  { id: "sig-ahu2a-temp", name: "AHU 2A / Supply Temp", kind: "signal", parentId: "dev-temp-ahu2a", health: "critical", tags: ["telemetry"] },
  { id: "sig-chiller1-press", name: "Chiller 1 / Pressure", kind: "signal", parentId: "dev-press-chiller1", health: "healthy", tags: ["telemetry"] },
];

export const assetRelations: AssetRelation[] = [
  { id: "r1", from: "eq-pump-4", to: "eq-ahu-2a", kind: "feeds" },
  { id: "r2", from: "eq-pump-4", to: "eq-ahu-2b", kind: "feeds" },
  { id: "r3", from: "eq-chiller-1", to: "eq-pump-4", kind: "feeds" },
  { id: "r4", from: "dev-vfd-pump4", to: "eq-pump-4", kind: "controls" },
  { id: "r5", from: "dev-temp-ahu2a", to: "eq-ahu-2a", kind: "measures" },
  { id: "r6", from: "dev-flow-pump4", to: "eq-pump-4", kind: "measures" },
  { id: "r7", from: "eq-ahu-2a", to: "flr-a-2", kind: "located_in" },
  { id: "r8", from: "eq-ahu-2b", to: "flr-a-2", kind: "located_in" },
  { id: "r9", from: "eq-pump-4", to: "eq-panel-mdb", kind: "depends_on" },
  { id: "r10", from: "eq-chiller-1", to: "eq-panel-mdb", kind: "depends_on" },
];

export const assetKindLabels: Record<AssetKind, string> = {
  building: "Building",
  floor: "Floor",
  system: "System",
  equipment: "Equipment",
  device: "Device",
  signal: "Signal",
};

// AI auto-explanations (mock NLG)
export function explainAsset(id: string): string | null {
  const a = assets.find((x) => x.id === id);
  if (!a) return null;
  if (a.id === "eq-pump-4") {
    return "Pump 4 supplies cooling to Floor 2 through AHU 2A and AHU 2B, controlled by VFD ACS580, depends on the Main Distribution Panel.";
  }
  if (a.id === "eq-chiller-1") {
    return "Chiller 1 feeds Pump 4 and is the primary cooling source for Tower A.";
  }
  if (a.id === "eq-ahu-2a") {
    return "AHU 2A serves Floor 2; supply temperature is currently reporting a critical sensor reading.";
  }
  return null;
}
