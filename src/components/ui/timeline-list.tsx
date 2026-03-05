import { useState } from "react";
import { ChevronRight } from "lucide-react";

/**
 * Unified vertical timeline component — Vercel-style.
 * Used for: incident chronology, version history, system story, audit logs.
 */

export interface TimelineItem {
  id: string;
  /** Monospace left label (time, version, etc.) */
  label: string;
  title: string;
  description?: string;
  /** Optional metadata line */
  meta?: React.ReactNode;
  /** Dot color — semantic token name */
  dotColor?: "primary" | "success" | "warning" | "destructive" | "muted-foreground";
  /** Icon to show instead of dot */
  icon?: React.ReactNode;
  /** Whether this item is highlighted (current version, active step, etc.) */
  active?: boolean;
  /** Right-side action */
  action?: React.ReactNode;
}

interface TimelineListProps {
  items: TimelineItem[];
  /** Whether items are expandable on click */
  expandable?: boolean;
  /** Panel header title */
  title?: string;
  /** Header icon */
  headerIcon?: React.ReactNode;
}

const dotColorMap: Record<string, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  "muted-foreground": "bg-muted-foreground/60",
};

export function TimelineList({ items, expandable = false, title, headerIcon }: TimelineListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="vercel-card">
      {title && (
        <div className="ide-header flex items-center gap-1.5">
          {headerIcon}
          <span>{title}</span>
        </div>
      )}
      <div className="p-3 relative">
        {/* Vertical line */}
        <div className="absolute left-[1.55rem] top-3 bottom-3 w-px bg-border" />

        <div className="space-y-0">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            const dotClass = dotColorMap[item.dotColor || "muted-foreground"];

            return (
              <button
                key={item.id}
                onClick={() => expandable && setExpandedId(isExpanded ? null : item.id)}
                className={`w-full text-left relative pl-10 pr-3 py-2 rounded-md transition-colors duration-150 ${
                  expandable ? "hover:bg-muted/50 cursor-pointer" : "cursor-default"
                } ${item.active ? "bg-accent/50" : ""}`}
              >
                {/* Dot */}
                <div className="absolute left-[1.05rem] top-3 flex flex-col items-center">
                  {item.icon ? (
                    <div className="w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center z-10">
                      {item.icon}
                    </div>
                  ) : (
                    <div className={`w-2.5 h-2.5 rounded-full z-10 ${dotClass}`} />
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-[10px] text-muted-foreground w-12 flex-shrink-0">
                    {item.label}
                  </span>
                  <span className="text-foreground font-medium flex-1 truncate">
                    {item.title}
                  </span>
                  {item.action}
                  {expandable && (
                    <ChevronRight className={`w-3 h-3 text-muted-foreground transition-transform duration-150 flex-shrink-0 ${isExpanded ? "rotate-90" : ""}`} />
                  )}
                </div>

                {item.meta && (
                  <div className="mt-0.5 ml-14 text-[10px] text-muted-foreground">
                    {item.meta}
                  </div>
                )}

                {expandable && isExpanded && item.description && (
                  <div className="mt-1 ml-14 text-[11px] text-muted-foreground animate-fade-in leading-relaxed">
                    {item.description}
                  </div>
                )}

                {!expandable && item.description && (
                  <div className="mt-0.5 ml-14 text-[11px] text-muted-foreground">
                    {item.description}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
