import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Editorial case study page — light theme, scoped via inline CSS variables.
// Pacing/typography matches Liya Bell-style references.

const ACCENT = "#3FB68B"; // operational green
const BG = "#F3F3F1";
const INK = "#0A0A0A";
const MUTED = "#6B6B68";
const HAIRLINE = "#E2E2DE";
const DARK_SURFACE = "#0E1311";

export default function CaseStudy() {
  return (
    <div
      className="min-h-screen w-full font-sans antialiased"
      style={{
        background: BG,
        color: INK,
        // @ts-ignore
        "--accent": ACCENT,
        "--ink": INK,
        "--muted": MUTED,
        "--hairline": HAIRLINE,
      } as React.CSSProperties}
    >
      <TopBar />
      <Hero />
      <Divider />
      <SectionMarkers />
      <MetaRow />

      <SectionReality />
      <Divider />
      <SectionUXShift />
      <Divider />
      <SectionMentalModels />
      <Divider />

      <FeatureBlock
        index="05"
        kicker="ARTIFACT · INCIDENT TIMELINE"
        title={<>What the incident <Accent>timeline</Accent><br/>became.</>}
        body="Operators reconstructed failures manually — Outlook escalations, telemetry logs, maintenance updates, all stitched together by memory. The redesign introduced a replayable operational timeline: signal spike → rule activation → escalation → assignment → maintenance acknowledgment → resolution."
        hint="Try replaying the escalation chain."
        screen={<TimelineScreenshot/>}
      />
      <Divider />

      <FeatureBlock
        index="06"
        kicker="SCREEN 01 · OPERATIONAL VISIBILITY"
        title={<>The dashboard became<br/>a <Accent>live operational surface.</Accent></>}
        body="Every row exposed lifecycle state, escalation status, telemetry health, propagation, ownership, and sync confidence. Instead of passive monitoring, operators could instantly understand what was happening, who owned it, and what was blocked."
        hint="Hover a signal row to inspect escalation state."
        screen={<LiveStatusScreenshot/>}
      />
      <Divider />

      <FeatureBlock
        index="07"
        kicker="HOTSPOT 01 · LIFECYCLE MODELING"
        title={<>Operational nuance needed<br/>more than <Accent>active/inactive.</Accent></>}
        body="Industrial incidents move through monitoring, maintenance, engineering, and field operations. The lifecycle model carried ownership, SLA visibility, escalation behavior, and Outlook notifications inside each state."
        hint="Click a lifecycle state to inspect escalation behavior."
        screen={<LifecycleScreenshot/>}
      />
      <Divider />

      <FeatureBlock
        index="08"
        kicker="HOTSPOT 02 · DEPENDENCY INTELLIGENCE"
        title={<><Accent>Blast radius,</Accent><br/>before deployment.</>}
        body="Changing telemetry thresholds or escalation logic could affect facilities, reporting, operational load, maintenance scheduling, and runtime automations. The system exposed dependency chains before any change was published."
        hint="Hover any node to trace operational impact."
        screen={<BlastRadiusScreenshot/>}
      />
      <Divider />

      <FeatureBlock
        index="09"
        kicker="SCREEN 02 · VALIDATION"
        title={<>Validation that happens<br/><Accent>before production.</Accent></>}
        body="Instead of discovering operational failures after deployment, the system validates propagation conflicts, escalation inconsistencies, telemetry schema problems, and duplicate operational logic in real time."
        hint="Try editing telemetry thresholds."
        screen={<ValidationScreenshot/>}
      />
      <Divider />

      <FeatureBlock
        index="10"
        kicker="SCREEN 03 · BULK OPERATIONS"
        title={<>Operational metadata<br/>at <Accent>industrial scale.</Accent></>}
        body="Teams managed thousands of telemetry rules and escalation mappings across facilities. Bulk tooling introduced normalization, duplicate detection, propagation preview, and runtime validation — operational confidence at paste-speed."
        hint="Watch raw operational data become validated infrastructure."
        screen={<BulkScreenshot/>}
      />
      <Divider />

      <FeatureBlock
        index="11"
        kicker="SCREEN 04 · REPORTING"
        title={<>Reporting became<br/><Accent>operational intelligence.</Accent></>}
        body="Admins configured templates, telemetry mappings, KPIs, and escalation summaries. Operators consumed simplified runtime tables that linked incidents, telemetry, maintenance, and operational health in one trace."
        hint="Open linked telemetry traces."
        screen={<ReportingScreenshot/>}
      />
      <Divider />

      <FeatureBlock
        index="12"
        kicker="SCREEN 05 · OUTLOOK FLOW"
        title={<>Operational coordination<br/>moved through <Accent>Outlook.</Accent></>}
        body="Industrial operations relied heavily on Outlook escalation chains. The redesign integrated ownership changes, incident escalation, maintenance acknowledgment, SLA reminders, and resolution updates directly into the operational workflow."
        hint="Open escalation history."
        screen={<OutlookScreenshot/>}
      />
      <Divider />

      <SectionSystems />
      <Divider />
      <SectionOutcome />
      <Divider />
      <SectionImpact />
      <Divider />
      <Footer />
    </div>
  );
}

/* ---------------- shared bits ---------------- */

function Accent({ children }: { children: React.ReactNode }) {
  return <span style={{ color: ACCENT }}>{children}</span>;
}

function Divider() {
  return <div style={{ height: 1, background: HAIRLINE }} className="w-full" />;
}

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-[1280px] mx-auto px-8 md:px-14 ${className}`}>{children}</div>;
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[11px] tracking-[0.18em]" style={{ color: ACCENT, fontFamily: "JetBrains Mono, monospace" }}>
      <span>{children}</span>
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
    </div>
  );
}

function MutedMono({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={className} style={{ fontFamily: "JetBrains Mono, monospace", color: MUTED, fontSize: 11, letterSpacing: "0.12em" }}>
      {children}
    </span>
  );
}

/* ---------------- top bar ---------------- */

function TopBar() {
  return (
    <Container className="pt-8 pb-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="font-semibold tracking-tight text-[15px]">Telemetry Studio</span>
        <span style={{ color: HAIRLINE }}>|</span>
        <span className="text-[13px]" style={{ color: MUTED }}>Industrial Observability & Incident Operations</span>
      </div>
      <div className="flex items-center gap-6 text-[13px]" style={{ color: MUTED }}>
        <Link to="/studio" className="hover:opacity-70 transition" style={{ color: INK }}>Open Platform →</Link>
      </div>
    </Container>
  );
}

/* ---------------- HERO ---------------- */

function Hero() {
  return (
    <Container className="pt-24 md:pt-32 pb-20">
      <h1
        className="font-semibold tracking-[-0.035em] leading-[0.95]"
        style={{ fontSize: "clamp(56px, 9vw, 132px)" }}
      >
        Operational trust<br/>
        for industrial{" "}
        <span style={{ fontFamily: "'Instrument Serif', 'Cormorant Garamond', Georgia, serif", fontStyle: "italic", color: ACCENT, fontWeight: 400 }}>
          telemetry
        </span>
        <span style={{ color: ACCENT }}>.</span>
      </h1>

      <p className="mt-12 max-w-[640px] text-[15px] leading-[1.6]" style={{ color: "#2A2A28" }}>
        How I redesigned telemetry monitoring, incident coordination, and operational workflows
        inside a localized GE industrial environment — turning fragmented infrastructure signals
        into observable operational systems.
      </p>

      <div className="mt-10 flex flex-wrap gap-2">
        {["Product Design","Systems Design","Observability","Incident Operations","ERP Workflows","Industrial Infrastructure"].map(t => (
          <span key={t} className="px-4 py-1.5 rounded-full text-[12px]" style={{ border: `1px solid ${HAIRLINE}`, background: "white", fontFamily: "JetBrains Mono, monospace", color: "#2A2A28" }}>
            {t}
          </span>
        ))}
      </div>

      <div className="mt-32 flex items-center gap-3">
        <span className="block w-10 h-px" style={{ background: MUTED }} />
        <MutedMono>SCROLL TO EXPLORE</MutedMono>
      </div>
    </Container>
  );
}

/* ---------------- section markers strip ---------------- */

function SectionMarkers() {
  const items = ["RUNTIME VISIBILITY","ESCALATION CHAINS","DEPENDENCY GRAPH","LIFECYCLE STATES","DEPLOYMENT SAFETY","BLAST RADIUS"];
  return (
    <Container className="py-6">
      <div className="flex items-center justify-between flex-wrap gap-y-3">
        {items.map((it) => (
          <div key={it} className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
            <MutedMono>{it}</MutedMono>
          </div>
        ))}
      </div>
    </Container>
  );
}

function MetaRow() {
  const meta = [
    ["ROLE","Lead Product Designer"],
    ["SCOPE","End-to-end UX + operational workflows"],
    ["DOMAIN","Industrial telemetry / ERP operations"],
    ["PLATFORM","GE localized infrastructure"],
  ];
  return (
    <>
      <Divider />
      <Container className="py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {meta.map(([k,v]) => (
          <div key={k}>
            <MutedMono>{k}</MutedMono>
            <div className="mt-2 text-[15px] leading-snug" style={{ color: INK }}>{v}</div>
          </div>
        ))}
      </Container>
    </>
  );
}

/* ---------------- 01 reality ---------------- */

function SectionReality() {
  return (
    <Container className="py-32">
      <Kicker>02 — THE REALITY</Kicker>
      <h2 className="mt-10 font-semibold tracking-[-0.02em] leading-[1.02]" style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}>
        Incidents moved faster<br/>
        than{" "}
        <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", color: ACCENT, fontWeight: 400 }}>
          understanding.
        </span>
      </h2>

      <div className="mt-16 grid md:grid-cols-2 gap-16">
        <div className="text-[15px] leading-[1.7]" style={{ color: "#2A2A28" }}>
          <p>
            Industrial operators were reacting to failures across distributed facilities using fragmented tools:
            Outlook threads, spreadsheets, verbal escalation, disconnected dashboards.
          </p>
          <p className="mt-6">Telemetry existed. Operational visibility did not.</p>
          <p className="mt-6">Operators could see alerts — but not propagation, causality, escalation ownership, downstream impact, or runtime state.</p>

          <div className="mt-12 space-y-0">
            {[
              ["01","A pressure spike triggered three conflicting escalations.","Across maintenance, control room, and field ops — no single source of truth."],
              ["02","A telemetry sync failure silently invalidated reporting.","Discovered four hours later, after a shift handover."],
              ["03","Maintenance teams received incidents without operational context.","No history, no dependencies, no acknowledgment trail."],
            ].map(([n,t,d]) => (
              <div key={n} className="grid grid-cols-[40px_1fr] gap-6 py-5 border-t" style={{ borderColor: HAIRLINE }}>
                <MutedMono>{n}</MutedMono>
                <div>
                  <div className="text-[14px] font-medium" style={{ color: INK }}>{t}</div>
                  <div className="mt-1 text-[13px]" style={{ color: MUTED }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <DependencyTopologyArtifact />
        </div>
      </div>
    </Container>
  );
}

function DependencyTopologyArtifact() {
  return (
    <div className="rounded-md p-6" style={{ background: "white", border: `1px solid ${HAIRLINE}` }}>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
        <MutedMono>DEPENDENCY TOPOLOGY</MutedMono>
      </div>
      <div className="mt-2 text-[13px]" style={{ color: MUTED }}>
        Hover any node to trace what one telemetry change touches downstream.
      </div>
      <svg viewBox="0 0 480 320" className="w-full mt-6">
        {[
          ["M 110 80 L 280 80","M 110 80 L 280 160","M 110 160 L 280 80","M 110 160 L 280 160","M 110 160 L 280 240","M 110 240 L 280 160","M 110 240 L 280 240"]
        ][0].map((d,i)=>(
          <path key={i} d={d} stroke={MUTED} strokeWidth={0.6} fill="none" opacity={0.5}/>
        ))}
        {[["TI-R12-01",110,80],["PI-R12-01",110,160],["XV-R12-01",110,240]].map(([t,x,y]:any)=>(
          <g key={t}>
            <rect x={x-50} y={y-14} width={100} height={28} rx={4} fill="white" stroke={INK} strokeWidth={0.6}/>
            <text x={x} y={y+4} textAnchor="middle" fontSize={11} fill={INK} fontFamily="JetBrains Mono">{t}</text>
          </g>
        ))}
        {[["Reactor-12",280,80],["Reporting",280,160],["Maintenance",280,240]].map(([t,x,y]:any)=>(
          <g key={t}>
            <rect x={x-60} y={y-14} width={120} height={28} rx={4} fill="white" stroke={INK} strokeWidth={0.6}/>
            <text x={x} y={y+4} textAnchor="middle" fontSize={11} fill={INK} fontFamily="JetBrains Mono">{t}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ---------------- 02 ux shift ---------------- */

function SectionUXShift() {
  return (
    <Container className="py-32">
      <Kicker>03 — CORE UX SHIFT</Kicker>
      <div className="mt-10 text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-[1.05]" style={{ color: "#A8A8A4", textDecoration: "line-through", textDecorationThickness: "2px" }}>
        Dashboard administration
      </div>
      <div className="mt-6 flex items-center gap-2 text-[12px]" style={{ color: ACCENT, fontFamily: "JetBrains Mono, monospace" }}>
        ↓ the breakthrough
      </div>
      <h2 className="mt-4 font-semibold tracking-[-0.02em] leading-[1.02]" style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}>
        <Accent>Operational observability.</Accent>
      </h2>

      <p className="mt-12 max-w-[680px] text-[15px] leading-[1.7]" style={{ color: "#2A2A28" }}>
        The system stopped behaving like a monitoring interface and started behaving like operational infrastructure.
        Every screen became state-aware: lifecycle, propagation, ownership, dependency chains, operational safety, escalation history.
      </p>
    </Container>
  );
}

/* ---------------- 03 mental models ---------------- */

function SectionMentalModels() {
  return (
    <Container className="py-32">
      <Kicker>04 — CORE UX DECISION</Kicker>
      <h2 className="mt-10 font-semibold tracking-[-0.02em] leading-[1.02] max-w-[1100px]" style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}>
        Separating infrastructure<br/>
        governance from{" "}
        <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", color: ACCENT, fontWeight: 400 }}>
          operations.
        </span>
      </h2>

      <p className="mt-12 max-w-[640px] text-[15px] leading-[1.7]" style={{ color: "#2A2A28" }}>
        One platform. Two completely different operational mental models. Combining them created cognitive overload,
        operational risk, and permission complexity. Splitting them created safer, faster work — for both teams.
      </p>

      <div className="mt-20 grid md:grid-cols-[1fr_60px_1fr] gap-0 items-stretch">
        <ModelCard
          tag="GOVERNANCE LAYER"
          title="Infrastructure Governance"
          body="Engineering and operational leads maintain telemetry structures, escalation matrices, lifecycle rules, and deployment safety."
          rows={[
            ["OWNERS","Engineering · Ops leads"],
            ["CADENCE","Weekly · governance-led"],
            ["CONCERNS","Propagation · stability · rollback safety"],
            ["MENTAL MODEL","Infrastructure consistency"],
          ]}
        />
        <div className="hidden md:flex items-center justify-center">
          <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", color: MUTED }}>vs</span>
        </div>
        <ModelCard
          tag="OPERATIONS LAYER"
          title="Operational Execution"
          body="Operators investigate incidents, acknowledge escalations, monitor runtime health, and resolve failures under time pressure."
          rows={[
            ["OWNERS","Control room · Field ops · Maintenance"],
            ["CADENCE","Continuous · incident-driven"],
            ["CONCERNS","Speed · clarity · escalation coordination"],
            ["MENTAL MODEL","Operational visibility"],
          ]}
        />
      </div>
    </Container>
  );
}

function ModelCard({ tag, title, body, rows }: { tag: string; title: string; body: string; rows: [string,string][] }) {
  return (
    <div className="rounded-lg p-8 md:p-10" style={{ background: "white", border: `1px solid ${HAIRLINE}` }}>
      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10.5px] tracking-[0.12em]" style={{ background: "#E9F6F0", color: ACCENT, fontFamily: "JetBrains Mono, monospace" }}>
        {tag}
      </span>
      <h3 className="mt-5 text-[24px] font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 text-[14px] leading-[1.6]" style={{ color: "#2A2A28" }}>{body}</p>
      <div className="mt-8">
        {rows.map(([k,v]) => (
          <div key={k} className="grid grid-cols-[140px_1fr] gap-4 py-3 border-t" style={{ borderColor: HAIRLINE }}>
            <MutedMono>{k}</MutedMono>
            <div className="text-[13.5px]" style={{ color: INK }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- generic feature block ---------------- */

function FeatureBlock({
  index, kicker, title, body, hint, screen,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  body: string;
  hint: string;
  screen: React.ReactNode;
}) {
  return (
    <Container className="py-32">
      <Kicker>{index} — {kicker}</Kicker>
      <h2 className="mt-10 font-semibold tracking-[-0.02em] leading-[1.02] max-w-[1100px]" style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}>
        {title}
      </h2>
      <p className="mt-10 max-w-[640px] text-[15px] leading-[1.7]" style={{ color: "#2A2A28" }}>{body}</p>

      <div className="mt-16">
        {screen}
        <p className="mt-6 text-center text-[12.5px] italic" style={{ color: MUTED, fontFamily: "'Instrument Serif', Georgia, serif" }}>
          ↑ {hint}
        </p>
      </div>
    </Container>
  );
}

/* ---------------- screenshot mocks (dark UI) ---------------- */

function DarkFrame({ url, children, height = 520 }: { url: string; children: React.ReactNode; height?: number }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: DARK_SURFACE, border: `1px solid #1B2220`, boxShadow: "0 30px 80px -40px rgba(0,0,0,0.25)" }}>
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid #1B2220" }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
        <div className="mx-3 flex-1 max-w-[560px] h-7 rounded-md flex items-center justify-center text-[11px]" style={{ background: "#0A0F0E", color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>
          {url}
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1.5" style={{ background: "rgba(63,182,139,0.12)", color: ACCENT, fontFamily: "JetBrains Mono, monospace" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} /> LIVE DEMO
        </span>
      </div>
      <div style={{ minHeight: height }} className="p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}

function Hotspot({ n, top, left, label }: { n: number; top: string; left: string; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute" style={{ top, left }}>
      <button
        onMouseEnter={()=>setOpen(true)}
        onMouseLeave={()=>setOpen(false)}
        className="relative flex items-center justify-center"
      >
        <span className="absolute w-7 h-7 rounded-full animate-ping" style={{ background: ACCENT, opacity: 0.25 }} />
        <span className="relative w-6 h-6 rounded-full text-[11px] font-semibold flex items-center justify-center" style={{ background: ACCENT, color: "white", fontFamily: "JetBrains Mono, monospace" }}>
          {n}
        </span>
        {open && label && (
          <div className="absolute left-8 top-0 whitespace-nowrap px-3 py-1.5 rounded-md text-[11px]" style={{ background: "white", color: INK, border: `1px solid ${HAIRLINE}`, fontFamily: "JetBrains Mono, monospace" }}>
            {label}
          </div>
        )}
      </button>
    </div>
  );
}

/* ---- Feature 01: Timeline ---- */
function TimelineScreenshot() {
  const [step, setStep] = useState(5);
  const steps = [
    ["09:33:02","SIGNAL","TI-R12-01.PV = 89°C ↑ approaching 90°C"],
    ["09:34:00","RULE","Контроль перегрева → ACTIVATED"],
    ["09:34:01","ESCALATION","Tier-1 → Control room (auto)"],
    ["09:34:12","ASSIGNED","E. Marx · maintenance lead"],
    ["09:36:44","ACK","Field crew acknowledged via Outlook"],
    ["09:48:10","RESOLVED","XV-R12-01 closed · temp 84°C"],
  ];
  return (
    <div className="relative">
      <DarkFrame url="telemetry.studio/incidents/INC-4201/timeline">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[11px] tracking-[0.14em]" style={{ color: ACCENT, fontFamily: "JetBrains Mono, monospace" }}>INC-4201 · REACTOR-12 OVERHEAT</div>
            <div className="mt-2 text-[20px] text-white font-semibold">Escalation chain · replay mode</div>
          </div>
          <button
            onClick={()=>setStep((s)=> (s>=steps.length? 1 : s+1))}
            className="px-3 py-1.5 rounded-full text-[11px] flex items-center gap-2"
            style={{ border: `1px solid ${ACCENT}`, color: ACCENT, fontFamily: "JetBrains Mono, monospace" }}
          >↻ REPLAY</button>
        </div>

        <div className="space-y-0">
          {steps.map(([t,kind,msg], i) => {
            const active = i < step;
            return (
              <div key={i} className="grid grid-cols-[80px_70px_1fr_120px] gap-4 py-3 items-center" style={{ borderTop: "1px solid #1B2220", opacity: active ? 1 : 0.35, transition: "opacity 400ms" }}>
                <span className="text-[11px]" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>{t}</span>
                <span className="text-[10px] font-semibold" style={{ color: kind==="RULE"||kind==="ESCALATION" ? "#E5A545" : kind==="RESOLVED" ? ACCENT : "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>{kind}</span>
                <span className="text-[13px] text-white/90">{msg}</span>
                <span className="text-[10px]" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>{active ? "● synced" : "pending"}</span>
              </div>
            );
          })}
        </div>
      </DarkFrame>
      <Hotspot n={1} top="38%" left="6%" label="Expand escalation"/>
      <Hotspot n={2} top="56%" left="6%" label="Open maintenance owner"/>
      <Hotspot n={3} top="22%" left="6%" label="Jump to telemetry spike"/>
      <Hotspot n={4} top="72%" left="6%" label="Outlook history"/>
    </div>
  );
}

/* ---- Feature 02: Live status ---- */
function LiveStatusScreenshot() {
  const rows = [
    ["TI-R12-01","Reactor-12 temp","96°C","● Critical","Escalated","E. Marx","2s"],
    ["PI-R12-01","Reactor-12 pressure","12.3bar","● Warning","Monitoring","Auto","4s"],
    ["XV-R12-01","Bleed valve","CLOSED","● Synced","Resolved","Control rm","1s"],
    ["SI-R12-01","Pump-A speed","1450 RPM","● Synced","Nominal","—","2s"],
    ["FI-R12-02","Coolant flow","412 L/m","● Synced","Nominal","—","3s"],
  ];
  return (
    <div className="relative">
      <DarkFrame url="telemetry.studio/live/reactor-12">
        <div className="grid grid-cols-[200px_1fr] gap-6">
          <div>
            <div className="text-[10px] tracking-[0.14em]" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>FACILITIES</div>
            {["Северное / R-12","Северное / R-08","Южное / R-04","Compressor stations"].map((f,i)=>(
              <div key={f} className="py-2 text-[12.5px]" style={{ color: i===0? "white":"#7C8C87" }}>{f}</div>
            ))}
          </div>
          <div>
            <div className="grid grid-cols-[110px_1fr_90px_110px_110px_110px_60px] gap-3 py-2 text-[10px] tracking-[0.12em]" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace", borderBottom: "1px solid #1B2220" }}>
              <span>SIGNAL</span><span>NAME</span><span>VALUE</span><span>HEALTH</span><span>LIFECYCLE</span><span>OWNER</span><span>SYNC</span>
            </div>
            {rows.map((r,i)=>(
              <div key={i} className="grid grid-cols-[110px_1fr_90px_110px_110px_110px_60px] gap-3 py-3 text-[12.5px] items-center hover:bg-white/[0.02] transition" style={{ borderBottom: "1px solid #11171533" }}>
                <span style={{ color: "white", fontFamily: "JetBrains Mono, monospace" }}>{r[0]}</span>
                <span className="text-white/80">{r[1]}</span>
                <span style={{ color: "white", fontFamily: "JetBrains Mono, monospace" }}>{r[2]}</span>
                <span style={{ color: r[3].includes("Critical")?"#E55":r[3].includes("Warning")?"#E5A545":ACCENT, fontFamily: "JetBrains Mono, monospace", fontSize: 11 }}>{r[3]}</span>
                <span className="text-white/70 text-[11px]">{r[4]}</span>
                <span className="text-white/70 text-[11px]">{r[5]}</span>
                <span style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace", fontSize: 11 }}>{r[6]}</span>
              </div>
            ))}
          </div>
        </div>
      </DarkFrame>
      <Hotspot n={1} top="30%" left="64%" label="Incident owner"/>
      <Hotspot n={2} top="40%" left="46%" label="Delayed propagation"/>
      <Hotspot n={3} top="50%" left="58%" label="Escalation queue"/>
      <Hotspot n={4} top="60%" left="80%" label="Runtime sync"/>
    </div>
  );
}

/* ---- Feature 03: Lifecycle ---- */
function LifecycleScreenshot() {
  const states = ["Draft","Assigned","Investigating","Escalated","Maintenance","Resolved","Archived"];
  const [active, setActive] = useState(3);
  const meta = [
    ["Saved by control room. Not yet routed. No SLA timer.","#7C8C87"],
    ["Routed to a named operator. SLA timer started.","#7C8C87"],
    ["Operator working the incident. Telemetry trace pinned.","#5DA0E5"],
    ["Crossed Tier-1 SLA. Auto-Outlook to Tier-2 + maintenance lead.","#E5A545"],
    ["Field crew dispatched. Maintenance owns acknowledgment.","#E5A545"],
    ["Closed with telemetry confirmation. Outlook resolution sent.","#3FB68B"],
    ["Sealed for audit. Post-mortem attached.","#7C8C87"],
  ];
  return (
    <DarkFrame url="telemetry.studio/incidents/lifecycle" height={420}>
      <div className="text-[10px] tracking-[0.14em] mb-6" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>CLICK A STATE · SEE WHAT IT MEANS</div>
      <div className="flex items-center gap-2 flex-wrap">
        {states.map((s,i)=>(
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={()=>setActive(i)}
              className="px-4 py-3 rounded-md text-[12px] flex items-center gap-2 transition"
              style={{ background: active===i ? "#1A2421" : "#0A1110", border: `1px solid ${active===i ? ACCENT : "#1B2220"}`, color: "white", fontFamily: "JetBrains Mono, monospace" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta[i][1] as string }}/>
              {s}
            </button>
            {i<states.length-1 && <span style={{ color: "#3A4540" }}>→</span>}
          </div>
        ))}
      </div>
      <div className="mt-8 p-5 rounded-md" style={{ background: "#0A1110", borderLeft: `2px solid ${meta[active][1]}` }}>
        <div className="text-[14px] text-white font-semibold">{states[active]}</div>
        <div className="mt-1 text-[13px]" style={{ color: "#A8B5B0" }}>{meta[active][0]}</div>
        <div className="mt-4 grid grid-cols-4 gap-4 text-[11px]" style={{ fontFamily: "JetBrains Mono, monospace", color: "#7C8C87" }}>
          <div>OWNERSHIP<div className="text-white/80 mt-1">Tier-{active}</div></div>
          <div>SLA<div className="text-white/80 mt-1">{["—","30m","2h","45m","4h","—","—"][active]}</div></div>
          <div>ESCALATES<div className="text-white/80 mt-1">{["—","Tier-2","Maintenance","Engineering","Field ops","—","—"][active]}</div></div>
          <div>OUTLOOK<div className="text-white/80 mt-1">{active>0 && active<6 ? "● auto" : "off"}</div></div>
        </div>
      </div>
    </DarkFrame>
  );
}

/* ---- Feature 04: Blast radius ---- */
function BlastRadiusScreenshot() {
  return (
    <DarkFrame url="telemetry.studio/rules/overheat-control/impact" height={460}>
      <div className="text-[10px] tracking-[0.14em] mb-6" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>HOVER ANY LEAF · TRACE THE CHAIN</div>
      <div className="grid grid-cols-[1fr_220px] gap-8">
        <svg viewBox="0 0 520 320" className="w-full">
          {[80,140,200,260].map((y,i)=>(
            <path key={i} d={`M 130 160 L 320 ${y}`} stroke="#3FB68B" strokeWidth={0.6} opacity={0.45}/>
          ))}
          <path d="M 320 80 L 440 100" stroke="#3FB68B" strokeWidth={0.6} opacity={0.45}/>
          <path d="M 320 200 L 440 200" stroke="#3FB68B" strokeWidth={0.6} opacity={0.45}/>
          <g>
            <rect x={70} y={146} width={120} height={28} rx={4} fill="#0A1110" stroke={ACCENT}/>
            <text x={130} y={164} textAnchor="middle" fontSize={11} fill={ACCENT} fontFamily="JetBrains Mono">overheat-control</text>
          </g>
          {[["Reactor-12 PMP",80],["Reactor-08 PMP",140],["Compressor-3",200],["Coolant-loop-A",260]].map(([t,y]:any)=>(
            <g key={t}>
              <rect x={260} y={y-14} width={120} height={28} rx={4} fill="#0A1110" stroke="#1B2220"/>
              <text x={320} y={y+4} textAnchor="middle" fontSize={11} fill="white" fontFamily="JetBrains Mono">{t}</text>
            </g>
          ))}
          {[["Reporting · Q",100],["Maintenance sched.",200]].map(([t,y]:any)=>(
            <g key={t}>
              <rect x={400} y={y-14} width={110} height={28} rx={4} fill="#0A1110" stroke="#1B2220"/>
              <text x={455} y={y+4} textAnchor="middle" fontSize={10} fill="white" fontFamily="JetBrains Mono">{t}</text>
            </g>
          ))}
        </svg>
        <div className="p-4 rounded-md" style={{ background: "#0A1110", border: "1px solid #1B2220" }}>
          <div className="text-[10px] tracking-[0.14em]" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>BLAST RADIUS</div>
          <div className="mt-2 text-[28px] font-semibold" style={{ color: ACCENT, fontFamily: "JetBrains Mono, monospace" }}>4 facilities</div>
          <div className="mt-1 text-[12px]" style={{ color: "#A8B5B0" }}>2 reporting pipelines · 1 maintenance schedule · 6 runtime automations</div>
          <div className="mt-5 space-y-2 text-[11px]" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>
            <div>● Facility dependencies</div>
            <div>● Escalation consumers</div>
            <div>● Runtime automations</div>
            <div>● Reporting pipelines</div>
          </div>
        </div>
      </div>
    </DarkFrame>
  );
}

/* ---- Feature 05: Validation ---- */
function ValidationScreenshot() {
  const [val, setVal] = useState("90");
  const conflict = parseInt(val) < 85;
  return (
    <DarkFrame url="telemetry.studio/rules/overheat-control · edit" height={420}>
      <div className="flex items-center justify-between mb-6">
        <div className="text-[10px] tracking-[0.14em]" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>TRY EDITING THE THRESHOLD</div>
        <button className="px-3 py-1.5 rounded-full text-[11px]" style={{ border: `1px solid ${ACCENT}`, color: ACCENT, fontFamily: "JetBrains Mono, monospace" }} onClick={()=>setVal("90")}>↻ REPLAY</button>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="p-5 rounded-md" style={{ background: "#0A1110", border: "1px solid #1B2220" }}>
          <div className="text-[10px] tracking-[0.14em]" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>THRESHOLD · TI-R12-01</div>
          <div className="mt-3 flex items-center gap-2">
            <input value={val} onChange={(e)=>setVal(e.target.value)} className="flex-1 bg-transparent outline-none text-[18px] text-white" style={{ fontFamily: "JetBrains Mono, monospace", border: `1px solid ${conflict?"#E55":"#1B2220"}`, padding: "10px 12px", borderRadius: 6 }}/>
            <span className="text-white/70">°C</span>
          </div>
          <div className="mt-3 text-[12px]" style={{ color: conflict ? "#E55" : ACCENT, fontFamily: "JetBrains Mono, monospace" }}>
            {conflict ? "✕ Below safety floor (85°C). Conflicts with rule R-019." : "✓ Valid · no propagation conflicts · safe to publish"}
          </div>
        </div>
        <div className="p-5 rounded-md" style={{ background: "#0A1110", border: "1px solid #1B2220" }}>
          <div className="text-[10px] tracking-[0.14em]" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>DOWNSTREAM IMPACT</div>
          <div className="mt-3 text-[18px] text-white" style={{ fontFamily: "JetBrains Mono, monospace" }}>4 facilities · 6 automations</div>
          <div className="mt-2 text-[12px]" style={{ color: "#A8B5B0" }}>Propagation window ~30s. Reporting will re-baseline within one cycle.</div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-5">
        {[["DUPLICATE CHECK","✓ No duplicate rules"],["FORMAT","✓ snake_case · valid"],["PROPAGATION", conflict?"✕ Conflict with R-019":"✓ No conflicts"]].map(([k,v]:any,i)=>(
          <div key={i} className="p-4 rounded-md" style={{ background: "#0A1110", border: "1px solid #1B2220" }}>
            <div className="text-[10px] tracking-[0.14em]" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>{k}</div>
            <div className="mt-2 text-[13px]" style={{ color: v.startsWith("✕")?"#E55":ACCENT, fontFamily: "JetBrains Mono, monospace" }}>{v}</div>
          </div>
        ))}
      </div>
    </DarkFrame>
  );
}

/* ---- Feature 06: Bulk ---- */
function BulkScreenshot() {
  const paste = ["temp_high","temp_high","TEMP_HIGH","press_max","flow_min","valve—closed","pump_rpm","cool_low"];
  const live = [
    ["temp_high","NEW","#3FB68B"],
    ["temp_high","DUP","#E5A545","duplicate within paste"],
    ["TEMP_HIGH","DUP","#E5A545","normalized to temp_high"],
    ["press_max","NEW","#3FB68B"],
    ["flow_min","NEW","#3FB68B"],
    ["valve—closed","INVALID","#E55","em-dash invalid"],
    ["pump_rpm","NEW","#3FB68B"],
    ["cool_low","NEW","#3FB68B"],
  ];
  return (
    <DarkFrame url="telemetry.studio/rules/bulk-import" height={520}>
      <div className="flex items-center justify-between mb-6">
        <div className="text-[10px] tracking-[0.14em]" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>WATCH RAW PASTE BECOME VALIDATED RULES</div>
        <button className="px-3 py-1.5 rounded-full text-[11px]" style={{ border: `1px solid ${ACCENT}`, color: ACCENT, fontFamily: "JetBrains Mono, monospace" }}>↻ REPLAY PARSE</button>
      </div>
      <div className="grid grid-cols-2 gap-px" style={{ background: "#1B2220" }}>
        <div className="p-5" style={{ background: "#0A1110" }}>
          <div className="text-[10px] tracking-[0.14em] mb-3" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>PASTE</div>
          {paste.map((p,i)=>(
            <div key={i} className="py-1 text-[13px] text-white/85" style={{ fontFamily: "JetBrains Mono, monospace" }}>{p}</div>
          ))}
        </div>
        <div className="p-5" style={{ background: "#0A1110" }}>
          <div className="text-[10px] tracking-[0.14em] mb-3" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>LIVE PREVIEW</div>
          {live.map((r:any,i)=>(
            <div key={i} className="grid grid-cols-[1fr_auto_70px] gap-3 items-center py-1 text-[13px]" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              <span className="text-white/85">{r[0]}</span>
              <span className="text-[10.5px] italic" style={{ color: "#7C8C87" }}>{r[3]||""}</span>
              <span className="text-[10px] px-2 py-0.5 rounded text-center" style={{ background: `${r[2]}22`, color: r[2] }}>{r[1]}</span>
            </div>
          ))}
          <div className="mt-4 pt-3 border-t text-[11px]" style={{ borderColor: "#1B2220", color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>
            6 <span className="text-white/60">new</span> · 2 <span className="text-white/60">duplicates</span> · 1 <span className="text-white/60">invalid</span>
          </div>
        </div>
      </div>
    </DarkFrame>
  );
}

/* ---- Feature 07: Reporting ---- */
function ReportingScreenshot() {
  return (
    <DarkFrame url="telemetry.studio/reports/Q1-operations" height={460}>
      <div className="grid grid-cols-3 gap-5 mb-6">
        {[["Incidents","124","↓ 18%"],["Avg understanding","41s","↓ 62%"],["Unresolved escalations","6","↓ 78%"]].map((c,i)=>(
          <div key={i} className="p-5 rounded-md" style={{ background: "#0A1110", border: "1px solid #1B2220" }}>
            <div className="text-[10px] tracking-[0.14em]" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>{c[0]}</div>
            <div className="mt-2 text-[28px] text-white font-semibold" style={{ fontFamily: "JetBrains Mono, monospace" }}>{c[1]}</div>
            <div className="text-[11px]" style={{ color: ACCENT, fontFamily: "JetBrains Mono, monospace" }}>{c[2]}</div>
          </div>
        ))}
      </div>
      <div className="rounded-md overflow-hidden" style={{ background: "#0A1110", border: "1px solid #1B2220" }}>
        <div className="grid grid-cols-[120px_1fr_120px_140px_100px] gap-3 px-5 py-2 text-[10px] tracking-[0.12em]" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace", borderBottom: "1px solid #1B2220" }}>
          <span>INCIDENT</span><span>FACILITY</span><span>OWNER</span><span>RESOLUTION</span><span>TRACE</span>
        </div>
        {[
          ["INC-4201","Северное / R-12","E. Marx","14m 22s","→ open"],
          ["INC-4198","Северное / R-08","Auto","2m 04s","→ open"],
          ["INC-4191","Южное / R-04","V. Petrov","41m 10s","→ open"],
          ["INC-4187","Compressor-3","M. Kowal","8m 51s","→ open"],
        ].map((r,i)=>(
          <div key={i} className="grid grid-cols-[120px_1fr_120px_140px_100px] gap-3 px-5 py-3 text-[12.5px]" style={{ borderTop: i?"1px solid #11171533":"none" }}>
            <span style={{ color: "white", fontFamily: "JetBrains Mono, monospace" }}>{r[0]}</span>
            <span className="text-white/80">{r[1]}</span>
            <span className="text-white/70">{r[2]}</span>
            <span className="text-white/70" style={{ fontFamily: "JetBrains Mono, monospace" }}>{r[3]}</span>
            <span style={{ color: ACCENT, fontFamily: "JetBrains Mono, monospace" }}>{r[4]}</span>
          </div>
        ))}
      </div>
    </DarkFrame>
  );
}

/* ---- Feature 08: Outlook ---- */
function OutlookScreenshot() {
  const msgs = [
    ["09:34:01","System → Control room","INC-4201 created · Reactor-12 overheat","escalation"],
    ["09:34:08","Control room → Maintenance","Owner: E. Marx · please ack","assignment"],
    ["09:36:44","E. Marx → System","Acknowledged · dispatching field crew","ack"],
    ["09:48:10","System → All","Resolved · XV-R12-01 closed · temp 84°C","resolution"],
  ];
  return (
    <DarkFrame url="telemetry.studio/incidents/INC-4201/outlook" height={420}>
      <div className="text-[10px] tracking-[0.14em] mb-6" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>ESCALATION HISTORY · OUTLOOK INTEGRATION</div>
      <div className="space-y-3">
        {msgs.map((m,i)=>{
          const left = i % 2 === 0;
          return (
            <div key={i} className={`flex ${left?"justify-start":"justify-end"}`}>
              <div className="max-w-[60%] p-4 rounded-md" style={{ background: "#0A1110", border: "1px solid #1B2220" }}>
                <div className="flex items-center gap-3 text-[10px]" style={{ color: "#7C8C87", fontFamily: "JetBrains Mono, monospace" }}>
                  <span>{m[0]}</span>
                  <span>·</span>
                  <span>{m[1]}</span>
                  <span className="ml-auto px-2 py-0.5 rounded" style={{ background: `${ACCENT}22`, color: ACCENT }}>{m[3]}</span>
                </div>
                <div className="mt-2 text-[13px] text-white/90">{m[2]}</div>
              </div>
            </div>
          );
        })}
      </div>
    </DarkFrame>
  );
}

/* ---------------- systems thinking ---------------- */
function SectionSystems() {
  const items = ["Operational workflows","Lifecycle modeling","Escalation systems","Dependency mapping","State architecture","Reporting infrastructure","ERP adaptation","Implementation alignment"];
  return (
    <Container className="py-32">
      <Kicker>13 — DESIGN SYSTEM THINKING</Kicker>
      <h2 className="mt-10 font-semibold tracking-[-0.02em] leading-[1.02] max-w-[1100px]" style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}>
        Systems thinking<br/>inside <Accent>every screen.</Accent>
      </h2>
      <p className="mt-10 max-w-[640px] text-[15px] leading-[1.7]" style={{ color: "#2A2A28" }}>
        This project was not only interface design. Some workflows were designed completely from scratch
        to support localized industrial operations inside the GE ecosystem.
      </p>
      <div className="mt-14 grid md:grid-cols-2 gap-x-16">
        {items.map((it,i)=>(
          <div key={it} className="grid grid-cols-[40px_1fr] gap-6 py-4 border-t" style={{ borderColor: HAIRLINE }}>
            <MutedMono>{String(i+1).padStart(2,"0")}</MutedMono>
            <div className="text-[15px]" style={{ color: INK }}>{it}</div>
          </div>
        ))}
      </div>
    </Container>
  );
}

/* ---------------- outcome ---------------- */
function SectionOutcome() {
  return (
    <Container className="py-32">
      <Kicker>14 — OUTCOME SHAPE</Kicker>
      <div className="mt-10 text-[40px] md:text-[56px] font-semibold tracking-[-0.02em] leading-[1.05]" style={{ color: "#A8A8A4", textDecoration: "line-through", textDecorationThickness: "2px" }}>
        Monitoring dashboards
      </div>
      <div className="mt-6 text-[12px]" style={{ color: ACCENT, fontFamily: "JetBrains Mono, monospace" }}>↓ into</div>
      <h2 className="mt-4 font-semibold tracking-[-0.02em] leading-[1.02]" style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}>
        <Accent>Operational infrastructure.</Accent>
      </h2>
      <p className="mt-12 max-w-[640px] text-[15px] leading-[1.7]" style={{ color: "#2A2A28" }}>
        The redesign transformed fragmented telemetry tooling into a unified operational system —
        observable, explainable, state-aware, escalation-aware, deployment-safe.
      </p>
    </Container>
  );
}

/* ---------------- impact ---------------- */
function SectionImpact() {
  const cards = [
    ["↓78%","Reduction in unresolved escalation loops","Q1 vs Q3 — same incident volume"],
    ["~40s","Average incident understanding time","Was: 6–18 min · context-dependent"],
    ["$1.2M","Estimated operational downtime risk prevented annually","Field ops, March 2026"],
  ];
  return (
    <Container className="py-32">
      <Kicker>15 — RESULTS THAT MOVED THE OPERATIONAL NEEDLE</Kicker>
      <h2 className="mt-10 font-semibold tracking-[-0.02em] leading-[1.02] max-w-[1100px]" style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}>
        Measured impact across<br/>
        <Accent>trust, coordination, and operational speed.</Accent>
      </h2>
      <div className="mt-16 grid md:grid-cols-3 gap-5">
        {cards.map((c,i)=>(
          <div key={i} className="p-8 rounded-lg" style={{ background: "white", border: `1px solid ${HAIRLINE}` }}>
            <div className="text-[56px] font-semibold tracking-tight" style={{ color: ACCENT }}>{c[0]}</div>
            <div className="mt-6 text-[14px] leading-[1.5]" style={{ color: INK }}>{c[1]}</div>
            <div className="mt-6 pt-6 border-t" style={{ borderColor: HAIRLINE }}>
              <MutedMono>{c[2]}</MutedMono>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

/* ---------------- footer ---------------- */
function Footer() {
  return (
    <Container className="py-20 flex items-end justify-between">
      <div>
        <div className="text-[28px] font-semibold tracking-tight">
          Telemetry <span style={{ color: ACCENT }}>Studio</span>
        </div>
        <div className="mt-2"><MutedMono>LEAD PRODUCT DESIGNER — END-TO-END UX</MutedMono></div>
      </div>
      <div className="text-right">
        <div className="text-[13px]" style={{ color: INK }}>Industrial Observability Platform</div>
        <div className="mt-1"><MutedMono>PRODUCT DESIGN CASE STUDY · 2026</MutedMono></div>
      </div>
    </Container>
  );
}
