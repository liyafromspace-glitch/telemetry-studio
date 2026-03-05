import { useState, useEffect } from "react";
import { Clock, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { StatusBadge } from "@/components/ui/status-badge";
import { SegmentBar } from "@/components/ui/segment-bar";

interface TimePoint {
  time: string;
  label: string;
  signals: Record<string, { value: number; status: "success" | "warning" | "error" }>;
}

const mockTimeline: TimePoint[] = [
  {
    time: "09:30", label: "Норма",
    signals: { src: { value: 82, status: "success" }, rule: { value: 0, status: "success" }, mx: { value: 0, status: "success" }, r1: { value: 0, status: "success" }, r2: { value: 0, status: "success" } },
  },
  {
    time: "09:31", label: "Рост температуры",
    signals: { src: { value: 88, status: "warning" }, rule: { value: 0, status: "success" }, mx: { value: 0, status: "success" }, r1: { value: 0, status: "success" }, r2: { value: 0, status: "success" } },
  },
  {
    time: "09:32", label: "Предупреждение",
    signals: { src: { value: 92, status: "warning" }, rule: { value: 1, status: "warning" }, mx: { value: 0, status: "warning" }, r1: { value: 0, status: "success" }, r2: { value: 0, status: "warning" } },
  },
  {
    time: "09:33", label: "Превышение порога",
    signals: { src: { value: 96, status: "error" }, rule: { value: 2, status: "error" }, mx: { value: 1, status: "warning" }, r1: { value: 0, status: "success" }, r2: { value: 1, status: "warning" } },
  },
  {
    time: "09:34", label: "Тревога активна",
    signals: { src: { value: 96, status: "error" }, rule: { value: 2, status: "error" }, mx: { value: 1, status: "error" }, r1: { value: 1, status: "warning" }, r2: { value: 1, status: "error" } },
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

  // Segment bar colors per time point
  const segmentColors = mockTimeline.map(tp => {
    const src = tp.signals.src;
    if (src?.status === "error") return "hsl(0, 84%, 60%)";
    if (src?.status === "warning") return "hsl(38, 92%, 50%)";
    return "hsl(142, 71%, 45%)";
  });

  return (
    <div className="px-4 py-3 border-b border-border animate-fade-in">
      <div className="flex items-center gap-3">
        {/* Controls */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onIndexChange(0)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <SkipBack className="w-3 h-3" />
          </button>
          <button
            onClick={() => setPlaying(!playing)}
            className="p-1.5 rounded-md bg-foreground/10 text-foreground hover:bg-foreground/15 transition-all"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onIndexChange(Math.min(currentIndex + 1, mockTimeline.length - 1))}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <SkipForward className="w-3 h-3" />
          </button>
        </div>

        {/* Time display */}
        <div className="flex items-center gap-1.5 text-xs min-w-[80px]">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="font-mono text-foreground font-medium">{current.time}</span>
        </div>

        {/* Slider */}
        <div className="flex-1">
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
        <div className="flex gap-0.5">
          {mockTimeline.map((tp, i) => (
            <button
              key={i}
              onClick={() => onIndexChange(i)}
              className={`px-2 py-1 rounded-md text-[10px] font-mono transition-all duration-200 ${
                i === currentIndex
                  ? "bg-foreground text-background font-medium"
                  : i < currentIndex
                  ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                  : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted"
              }`}
            >
              {tp.time}
            </button>
          ))}
        </div>

        {/* Status label */}
        <StatusBadge
          variant={current.signals.src?.status === "error" ? "error" : current.signals.src?.status === "warning" ? "warning" : "success"}
          size="xs"
        >
          {current.label}
        </StatusBadge>
      </div>

      <SegmentBar
        className="mt-2.5"
        segments={segmentColors.map((color, i) => ({
          color,
          active: i <= currentIndex,
        }))}
      />
    </div>
  );
}

export { mockTimeline };
