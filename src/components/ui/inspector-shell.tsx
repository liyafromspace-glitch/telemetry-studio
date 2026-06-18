import "@/components/admin/nostalgic.css";

export type InspectorTone = "success" | "warning" | "destructive" | "muted";

export const toneText: Record<InspectorTone, string> = {
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  muted: "text-muted-foreground",
};

export const toneSwatch: Record<InspectorTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground/40",
};

interface InspectorHeroProps {
  kind: string;
  id?: string;
  title: string;
  subtitle?: string;
  status?: { label: string; tone: InspectorTone };
}

export function InspectorHero({ kind, id, title, subtitle, status }: InspectorHeroProps) {
  return (
    <div className="relative px-4 pt-5 pb-4 border-b border-dashed border-border nostalgic-dot-grid-tight">
      <div className="absolute inset-0 nostalgic-scanlines pointer-events-none" />
      <div className="relative">
        <div className="n-label flex items-center gap-2">
          <span className="n-accent">▸</span> {kind}
          {id && (
            <>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-muted-foreground/60 truncate">{id}</span>
            </>
          )}
        </div>
        <div className="flex items-start justify-between gap-3 mt-1.5">
          <div className="text-[18px] font-mono font-semibold tracking-tight text-foreground leading-tight truncate">
            {title}
          </div>
          {status && (
            <span
              className={`flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider shrink-0 border border-current ${toneText[status.tone]}`}
            >
              <span className={`w-1.5 h-1.5 rounded-[1px] ${toneSwatch[status.tone]}`} />
              {status.label}
            </span>
          )}
        </div>
        {subtitle && (
          <div className="text-[11px] font-mono text-muted-foreground mt-1.5 uppercase tracking-wider truncate">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

interface InspectorShellProps {
  hero?: InspectorHeroProps;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function InspectorShell({ hero, children, footer }: InspectorShellProps) {
  return (
    <div className="nostalgic-scope flex flex-col h-full bg-card overflow-hidden border-l border-border">
      <div className="flex-1 overflow-y-auto min-h-0">
        {hero && <InspectorHero {...hero} />}
        {children}
      </div>
      {footer && <div className="p-3 border-t border-border">{footer}</div>}
    </div>
  );
}

export function InspectorRow({
  k,
  v,
  mono,
  children,
}: {
  k: string;
  v?: React.ReactNode;
  mono?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 font-mono text-[11px]">
      <span className="text-muted-foreground uppercase tracking-wider text-[10px]">{k}</span>
      {children ? (
        children
      ) : (
        <span className={`text-foreground/90 truncate ${mono ? "tabular-nums" : ""}`}>{v}</span>
      )}
    </div>
  );
}

export function InspectorTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-none bg-background text-foreground/80 border border-border">
      {children}
    </span>
  );
}

export function InspectorEmpty({ what, why, action }: { what: string; why: string; action: string }) {
  return (
    <div className="px-3 py-2 space-y-0.5 font-mono">
      <div className="text-[11px] text-foreground/80">{what}</div>
      <div className="text-[10px] text-muted-foreground leading-relaxed">{why}</div>
      <div className="text-[10px] text-[hsl(var(--conn-orange))] pt-0.5">→ {action}</div>
    </div>
  );
}
