import { PlatformShell } from "@/components/platform/PlatformShell";
import { type AppState } from "@/data/mockPlatform";

// ─── Demo Frame ──────────────────────────────────────────────────────────────

function DemoFrame({ initialState }: { initialState: AppState }) {
  return (
    <div className="h-[700px] w-full rounded-xl overflow-hidden border border-border shadow-2xl ring-1 ring-white/5">
      <PlatformShell initialState={initialState} embedded />
    </div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────

function WorkspaceLabel({ tag, label }: { tag: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="font-mono text-[10px] tracking-[0.2em] text-primary uppercase px-2 py-1 rounded border border-primary/30 bg-primary/8">
        {tag}
      </span>
      <span className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">
        {label}
      </span>
    </div>
  );
}

// ─── Stat ─────────────────────────────────────────────────────────────────────

function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-4xl font-semibold text-foreground tracking-tight">{value}</span>
      <span className="text-sm text-foreground/80 font-medium">{label}</span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}

// ─── Case Study Page ──────────────────────────────────────────────────────────

export function CaseStudy() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-[10px] font-bold">T</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">Telemetry Studio</span>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <span className="text-xs text-muted-foreground">Case Study</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <a href="https://liyabell.com" className="hover:text-foreground transition-colors">
              Liya Bell
            </a>
            <a
              href="https://www.linkedin.com/in/liya-b-352565143/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:liyafromspace@gmail.com"
              className="hover:text-foreground transition-colors"
            >
              liyafromspace@gmail.com
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-3xl">
          <p className="font-mono text-xs text-primary tracking-[0.2em] uppercase mb-6">
            Baker Hughes · Industrial Telemetry Platform
          </p>
          <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight text-foreground mb-8">
            Five workspaces.<br />One incident.<br />The whole plant.
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-10">
            A Baker Hughes telemetry platform processes thousands of sensor signals per second
            across oil field reservoirs. When a March overheat event in Reservoir-12 triggered
            cascading alerts, five distinct operator roles had no unified tool to move from alarm
            to root cause to fix to deployment — each lived in a separate system.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-12">
            Telemetry Studio collapses those five systems into one IDE-like environment, purpose-built
            for Russian-language field operators. One incident threads through every workspace below —
            follow it from detection to production deployment.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Real-time monitoring", "Root cause analysis", "Post-mortem reporting", "Rule authoring", "Deployment governance"].map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs border border-border rounded-full text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Incident thread ── */}
      <section className="border-y border-border bg-card/40">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-start gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0 animate-pulse" />
            <div>
              <p className="text-xs font-mono text-destructive font-medium mb-1">
                INCIDENT THREAD — 14 March · 09:23 UTC+3 · Северное месторождение / Резервуар-12
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-mono text-foreground">TI-R12-01.PV = 96°C</span> — reservoir temperature exceeded 90°C threshold.
                This single anomaly cascades through all five workspaces below. Every demo is fully interactive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── LIVE ─────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <WorkspaceLabel tag="01 · LIVE" label="Real-time monitoring" />
        <div className="grid grid-cols-2 gap-16 mb-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-4">
              Know what needs attention first
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Operators see every active signal ranked by severity. The alarm banner surfaces the
              critical breach immediately — a single "Debug →" click carries full signal context
              straight into the investigation workspace, no copy-paste, no context switch.
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The signal table shows live values against expected ranges, sparkline trends, and
              which rule or matrix each signal is bound to. The resizable trace panel beneath
              gives shift operators a running log without leaving the monitoring view.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Alarm prioritization", "Sparkline trends", "Signal-to-rule linkage", "One-click drill-down"].map(f => (
                <span key={f} className="px-2 py-0.5 text-[11px] bg-primary/8 text-primary border border-primary/20 rounded font-mono">{f}</span>
              ))}
            </div>
          </div>
        </div>
        <DemoFrame initialState="live" />
      </section>

      <div className="border-t border-border" />

      {/* ─────────────── DEBUG ─────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <WorkspaceLabel tag="02 · DEBUG" label="Incident investigation" />
        <div className="grid grid-cols-2 gap-16 mb-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-4">
              Replay the incident. Trace the cause.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every incident has a playback timeline, a causal chain, and a linked signal list.
              Engineers move through the chronology of the March overheat step by step — from
              the first anomaly to the escalation path — without digging through logs manually.
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The context inspector on the right panel shows what rules were active and what
              matrices were evaluating at the moment of the event. Task lists support shift
              handoffs: every action is assigned, tracked, and timestamped.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Incident playback", "Causal chain", "Task assignment", "Shift handoff log"].map(f => (
                <span key={f} className="px-2 py-0.5 text-[11px] bg-primary/8 text-primary border border-primary/20 rounded font-mono">{f}</span>
              ))}
            </div>
          </div>
        </div>
        <DemoFrame initialState="investigate" />
      </section>

      <div className="border-t border-border" />

      {/* ─────────────── TRACE ─────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <WorkspaceLabel tag="03 · TRACE" label="Post-mortem analysis" />
        <div className="grid grid-cols-2 gap-16 mb-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-4">
              Time-aligned signals for leadership review
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              After the incident is resolved, TRACE builds the post-mortem. Signal charts line
              up precisely with the event timeline, making the correlation between the temperature
              spike and pressure rise visually obvious for engineers and management alike.
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Reports link directly back to incident records and export to the format required
              for leadership review. The causal chain embedded in each report is the same one
              built during the DEBUG phase — one source of truth across roles.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Time-aligned charts", "Report generation", "Incident linkage", "Leadership export"].map(f => (
                <span key={f} className="px-2 py-0.5 text-[11px] bg-primary/8 text-primary border border-primary/20 rounded font-mono">{f}</span>
              ))}
            </div>
          </div>
        </div>
        <DemoFrame initialState="analyze" />
      </section>

      <div className="border-t border-border" />

      {/* ─────────────── EDIT ─────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <WorkspaceLabel tag="04 · EDIT" label="Rule authoring" />
        <div className="grid grid-cols-2 gap-16 mb-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-4">
              Write rules against live data, see impact before saving
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Rules are written in a code editor with the signal library in context. The
              sandbox simulation shows what the rule would have triggered against historical
              data — engineers know exactly what they're changing before they commit.
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The dependency graph shows which matrices reference the rule being edited.
              Version history lets any engineer see who changed a threshold, when, and why —
              critical for regulatory audit trails in industrial environments.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Live sandbox simulation", "Dependency graph", "Version control", "Audit trail"].map(f => (
                <span key={f} className="px-2 py-0.5 text-[11px] bg-primary/8 text-primary border border-primary/20 rounded font-mono">{f}</span>
              ))}
            </div>
          </div>
        </div>
        <DemoFrame initialState="configure" />
      </section>

      <div className="border-t border-border" />

      {/* ─────────────── DEPLOY ─────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <WorkspaceLabel tag="05 · DEPLOY" label="Deployment governance" />
        <div className="grid grid-cols-2 gap-16 mb-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-4">
              Accountability at every change, rollback in one click
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every rule and matrix change produces a structured audit entry — who changed it,
              what the diff is, which signals are affected, and what the expected impact is.
              No change reaches production without a reviewer.
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              If a new threshold introduces unexpected behavior in production, rollback is a
              single button. The audit log stays intact. This closes the loop from the March
              incident: the overheat triggered a rule fix, which was simulated, reviewed, and
              deployed with full traceability.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Change diff view", "Impact analysis", "One-click rollback", "Reviewer approval"].map(f => (
                <span key={f} className="px-2 py-0.5 text-[11px] bg-primary/8 text-primary border border-primary/20 rounded font-mono">{f}</span>
              ))}
            </div>
          </div>
        </div>
        <DemoFrame initialState="govern" />
      </section>

      {/* ─────────────── Design principles ─────────────── */}
      <section className="border-t border-border bg-card/30">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-xs text-primary tracking-[0.2em] uppercase mb-10">
            Design System · Foundations
          </p>
          <div className="grid grid-cols-4 gap-8">
            {[
              { n: "01", title: "Information hierarchy over decoration", body: "Every pixel earns its place. Visual weight maps directly to operational priority." },
              { n: "02", title: "Context travels with the operator", body: "Moving between workspaces carries the incident, signal, and timestamp — no re-entry." },
              { n: "03", title: "Monospace as a design token", body: "JetBrains Mono is not cosmetic — it preserves column alignment in sensor tables and code blocks." },
              { n: "04", title: "Status through colour, not iconography", body: "Critical / warning / normal are semantic colour tokens, consistent across every surface." },
              { n: "05", title: "Dense but not cluttered", body: "Comfortable and compact density modes let operators choose based on screen size and workflow." },
              { n: "06", title: "Every action is reversible", body: "Sandbox simulation before commit. Rollback after deploy. Undo everywhere." },
              { n: "07", title: "Localisation as a first-class concern", body: "Russian field labels are not a translation layer — they're part of the data model." },
              { n: "08", title: "Keyboard-first for power operators", body: "⌘K search, ⌘I debug, F12 go-to-definition — the same shortcuts engineers already know." },
            ].map(({ n, title, body }) => (
              <div key={n} className="space-y-2">
                <span className="font-mono text-[10px] text-muted-foreground/50">{n}</span>
                <h3 className="text-sm font-semibold text-foreground leading-snug">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── Results ─────────────── */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-xs text-primary tracking-[0.2em] uppercase mb-12">
            Measured Impact
          </p>
          <div className="grid grid-cols-3 gap-12 mb-12">
            <Stat
              value="78%"
              label="Reduction in escalation loops"
              sub="Operators resolved incidents without leaving the platform"
            />
            <Stat
              value="~40s"
              label="Incident comprehension time"
              sub="From alarm to understood root cause"
            />
            <Stat
              value="$1.2M"
              label="In prevented downtime risk"
              sub="Across the first quarter post-deployment"
            />
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Metrics were derived from operator session recordings and shift-handoff interviews
            conducted six weeks after the platform launched across the Northern Field cluster.
          </p>
        </div>
      </section>

      {/* ─────────────── Footer ─────────────── */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-12 flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Liya Bell · Product Designer</p>
            <p className="text-[11px] text-muted-foreground/50">
              Telemetry Studio · Baker Hughes · 2024
            </p>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <p className="text-[11px] text-muted-foreground/50 mb-1">Other projects</p>
            <a href="https://kvp-nexxen-case.vercel.app" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">KVP · Nexxen</a>
            <a href="https://liyabell.com/Smartgreen-1" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Smartgreen</a>
            <a href="https://liyabell.com/Walletallin" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Wallet All-In</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
