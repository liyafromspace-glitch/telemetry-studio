import { useState, useEffect } from "react";
import { Clock, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface TimePoint {
  time: string;
  label: string;
  signals: Record<string, { value: number; status: "success" | "warning" | "error" }>;
}

const mockTimeline: TimePoint[] = [
  {
    time: "09:30",
    label: "Норма",
    signals: {
      src: { value: 82, status: "success" },
      rule: { value: 0, status: "success" },
      mx: { value: 0, status: "success" },
      r1: { value: 0, status: "success" },
      r2: { value: 0, status: "success" },
    },
  },
  {
    time: "09:31",
    label: "Рост температуры",
    signals: {
      src: { value: 88, status: "warning" },
      rule: { value: 0, status: "success" },
      mx: { value: 0, status: "success" },
      r1: { value: 0, status: "success" },
      r2: { value: 0, status: "success" },
    },
  },
  {
    time: "09:32",
    label: "Предупреждение",
    signals: {
      src: { value: 92, status: "warning" },
      rule: { value: 1, status: "warning" },
      mx: { value: 0, status: "warning" },
      r1: { value: 0, status: "success" },
      r2: { value: 0, status: "warning" },
    },
  },
  {
    time: "09:33",
    label: "Превышение порога",
    signals: {
      src: { value: 96, status: "error" },
      rule: { value: 2, status: "error" },
      mx: { value: 1, status: "warning" },
      r1: { value: 0, status: "success" },
      r2: { value: 1, status: "warning" },
    },
  },
  {
    time: "09:34",
    label: "Тревога активна",
    signals: {
      src: { value: 96, status: "error" },
      rule: { value: 2, status: "error" },
      mx: { value: 1, status: "error" },
      r1: { value: 1, status: "warning" },
      r2: { value: 1, status: "error" },
    },
  },
];

interface GraphTimelineProps {
  onTimeChange: (point: TimePoint) => void;
  currentIndex: number;
  onIndexChange: (i: number) => void;
}

export type { TimePoint };

export function GraphTimeline({ onTimeChange, currentIndex, onIndexChange }: GraphTimelineProps) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      onIndexChange(currentIndex < mockTimeline.length - 1 ? currentIndex + 1 : 0);
    }, 1200);
    return () => clearInterval(interval);
  }, [playing, currentIndex, onIndexChange]);

  useEffect(() => {
    onTimeChange(mockTimeline[currentIndex]);
  }, [currentIndex, onTimeChange]);

  const current = mockTimeline[currentIndex];

  return (
    <div className="glass-controls rounded-lg px-4 py-2.5 mx-4 mt-3 animate-fade-in">
      <div className="flex items-center gap-3">
        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onIndexChange(0)}
            className="p-1 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <SkipBack className="w-3 h-3" />
          </button>
          <button
            onClick={() => setPlaying(!playing)}
            className="p-1.5 rounded-sm bg-primary/15 text-primary hover:bg-primary/25 transition-all"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onIndexChange(Math.min(currentIndex + 1, mockTimeline.length - 1))}
            className="p-1 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <SkipForward className="w-3 h-3" />
          </button>
        </div>

        {/* Time display */}
        <div className="flex items-center gap-1.5 text-xs min-w-[80px]">
          <Clock className="w-3 h-3 text-primary" />
          <span className="font-mono text-foreground font-medium">{current.time}</span>
        </div>

        {/* Slider */}
        <div className="flex-1 flex items-center gap-2">
          <Slider
            value={[currentIndex]}
            onValueChange={([v]) => onIndexChange(v)}
            min={0}
            max={mockTimeline.length - 1}
            step={1}
            className="flex-1"
          />
        </div>

        {/* Time ticks */}
        <div className="flex gap-1">
          {mockTimeline.map((tp, i) => (
            <button
              key={i}
              onClick={() => onIndexChange(i)}
              className={`px-1.5 py-0.5 rounded-sm text-[9px] font-mono transition-all duration-220 ${
                i === currentIndex
                  ? "bg-primary/20 text-primary shadow-[0_0_8px_hsl(var(--primary)/0.2)]"
                  : i < currentIndex
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-muted-foreground/50 hover:text-muted-foreground"
              }`}
            >
              {tp.time}
            </button>
          ))}
        </div>

        {/* Status label */}
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-sm border transition-all duration-220 ${
          current.signals.src?.status === "error"
            ? "border-destructive/30 bg-destructive/10 text-destructive"
            : current.signals.src?.status === "warning"
            ? "border-warning/30 bg-warning/10 text-warning"
            : "border-success/30 bg-success/10 text-success"
        }`}>
          {current.label}
        </span>
      </div>
    </div>
  );
}

export { mockTimeline };
