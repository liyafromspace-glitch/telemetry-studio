import { useState } from "react";
import { Boxes, Users, KeyRound, Plug, Database, Bell } from "lucide-react";
import { AssetManagementView } from "@/components/admin/AssetManagementView";

type AdminSection = "assets" | "users" | "roles" | "integrations" | "data" | "alerts";

const sections: { id: AdminSection; label: string; icon: typeof Boxes; available: boolean }[] = [
  { id: "assets", label: "Asset Management", icon: Boxes, available: true },
  { id: "users", label: "Users", icon: Users, available: false },
  { id: "roles", label: "Roles & Permissions", icon: KeyRound, available: false },
  { id: "integrations", label: "Integrations", icon: Plug, available: false },
  { id: "data", label: "Data Sources", icon: Database, available: false },
  { id: "alerts", label: "Alerts", icon: Bell, available: false },
];

export function AdminView() {
  const [section, setSection] = useState<AdminSection>("assets");

  return (
    <div className="flex-1 flex min-h-0">
      {/* Admin submodule sidebar */}
      <div className="w-52 min-w-52 bg-card border-r border-border flex flex-col shrink-0">
        <div className="px-4 py-2.5 border-b border-border">
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Admin
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-1.5">
          {sections.map((s) => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <button
                key={s.id}
                onClick={() => s.available && setSection(s.id)}
                disabled={!s.available}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                  active
                    ? "bg-accent text-foreground"
                    : "text-secondary-foreground hover:bg-accent/50"
                } ${!s.available ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{s.label}</span>
                {!s.available && (
                  <span className="ml-auto text-[9px] uppercase text-muted-foreground/60">soon</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section workspace */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {section === "assets" && <AssetManagementView />}
      </div>
    </div>
  );
}
