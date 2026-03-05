/**
 * Vercel-style colored segment bar — used for playback progress, execution flow, timeline scrubbing.
 */

interface SegmentBarProps {
  segments: {
    color: string;
    active: boolean;
  }[];
  className?: string;
}

export function SegmentBar({ segments, className = "" }: SegmentBarProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {segments.map((seg, i) => (
        <div
          key={i}
          className="flex-1 h-1.5 rounded-full transition-all duration-200"
          style={{
            background: seg.active ? seg.color : "hsl(0, 0%, 18%)",
            opacity: seg.active ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}
