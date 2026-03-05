import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsibleSectionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function CollapsibleSection({ title, open, onToggle, children }: CollapsibleSectionProps) {
  return (
    <Collapsible open={open} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-2 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors">
        <span>{title}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "" : "-rotate-90"}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="panel-section">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function PropRow({ label, value, mono, children }: { label: string; value?: string; mono?: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      {children ? children : (
        <span className={`text-foreground ${mono ? "font-mono text-[10px]" : "font-medium"}`}>
          {value}
        </span>
      )}
    </div>
  );
}
