import { useState } from "react";
import { assets } from "@/data/mockAssets";
import { Activity, Settings2, ListChecks, ScrollText } from "lucide-react";

interface AssetBottomTabsProps {
  selectedId: string | null;
}

type Tab = "telemetry" | "properties" | "bulk" | "events";

const tabs: { id: Tab; label: string; icon: typeof Activity }[] = [
  { id: "telemetry", label: "Telemetry", icon: Activity },
  { id: "properties", label: "Properties", icon: Settings2 },
  { id: "bulk", label: "Bulk Edit", icon: ListChecks },
  { id: "events", label: "Event Log", icon: ScrollText },
];

const fakeEvents = [
  { ts: "10:34:12", level: "warn", msg: "AHU 2A supply temp deviated +4.2°C" },
  { ts: "10:30:01", level: "info", msg: "Pump 4 VFD frequency set to 42 Hz" },
  { ts: "09:58:47", level: "error", msg: "Temp Sensor — AHU 2A reported NaN (4 samples)" },
  { ts: "09:12:30", level: "info", msg: "Chiller 1 entered staged operation" },
];

const levelColor: Record<string, string> = {
  info: "text-muted-foreground",
  warn: "text-warning",
  error: "text-destructive",
};

export function AssetBottomTabs({ selectedId }: AssetBottomTabsProps) {
  const [tab, setTab] = useState<Tab>("telemetry");
  const asset = assets.find((a) => a.id === selectedId);

  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      <div className="flex items-center px-2 border-b border-border shrink-0">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium border-b-2 transition-colors ${
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3 h-3" />
              {t.label}
            </button>
          );
        })}
        <div className="ml-auto pr-3 text-[10px] text-muted-foreground">
          {asset ? asset.name : "—"}
        </div>
      </div>
      <div className="flex-1 overflow-auto min-h-0 p-3 text-xs">
        {tab === "telemetry" && (
          <div className="space-y-2">
            {!asset && <div className="text-muted-foreground">Select an asset to view telemetry</div>}
            {asset && (
              <>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { l: "Samples / min", v: "1,240" },
                    { l: "Avg latency", v: "84 ms" },
                    { l: "Last value", v: asset.kind === "signal" ? "42.1" : "—" },
                    { l: "Quality", v: asset.health === "critical" ? "Bad" : "Good" },
                  ].map((s) => (
                    <div key={s.l}>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                      <div className="text-[14px] font-semibold tabular-nums text-foreground">{s.v}</div>
                    </div>
                  ))}
                </div>
                <svg viewBox="0 0 400 60" className="w-full h-16 mt-2">
                  <polyline
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="1.5"
                    points={Array.from({ length: 40 })
                      .map((_, i) => `${i * 10},${30 + Math.sin(i / 2) * 12 + (i % 5) * 1.5}`)
                      .join(" ")}
                  />
                </svg>
              </>
            )}
          </div>
        )}
        {tab === "properties" && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 max-w-2xl">
            {asset ? (
              [
                ["ID", asset.id],
                ["Name", asset.name],
                ["Kind", asset.kind],
                ["Health", asset.health],
                ["Vendor", asset.vendor || "—"],
                ["Model", asset.model || "—"],
                ["Tags", asset.tags.join(", ") || "—"],
                ["Parent", asset.parentId || "—"],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <div className="text-[11px] text-muted-foreground">{k}</div>
                  <div className="text-[11px] text-foreground font-mono">{v}</div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground col-span-2">Select an asset</div>
            )}
          </div>
        )}
        {tab === "bulk" && (
          <div className="space-y-2">
            <div className="text-[11px] text-muted-foreground">
              Select multiple assets in the tree to bulk-edit tags, vendor, or topology links.
            </div>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="py-1.5 font-medium">
                    <input type="checkbox" className="accent-primary" />
                  </th>
                  <th className="py-1.5 font-medium">Name</th>
                  <th className="py-1.5 font-medium">Kind</th>
                  <th className="py-1.5 font-medium">Tags</th>
                  <th className="py-1.5 font-medium">Health</th>
                </tr>
              </thead>
              <tbody>
                {assets.slice(0, 10).map((a) => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-accent/40">
                    <td className="py-1.5"><input type="checkbox" className="accent-primary" /></td>
                    <td className="py-1.5 text-foreground">{a.name}</td>
                    <td className="py-1.5 text-muted-foreground">{a.kind}</td>
                    <td className="py-1.5 text-muted-foreground">{a.tags.join(", ") || "—"}</td>
                    <td className="py-1.5 capitalize">{a.health}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === "events" && (
          <div className="space-y-1 font-mono">
            {fakeEvents.map((e, i) => (
              <div key={i} className="flex items-start gap-3 text-[11px]">
                <span className="text-muted-foreground">{e.ts}</span>
                <span className={`${levelColor[e.level]} uppercase w-12`}>{e.level}</span>
                <span className="text-foreground/90">{e.msg}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
