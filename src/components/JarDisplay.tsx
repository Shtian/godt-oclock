import { useNow } from "../hooks/useNow";
import { countdown, pad2 } from "../lib/time";
import { SevenSegment } from "./SevenSegment";

interface JarDisplayProps {
  target: Date;
}

/** The jar lid with its LCD, showing the live countdown to `target`. */
export function JarDisplay({ target }: JarDisplayProps) {
  const now = useNow();
  const { days, hours, minutes, seconds } = countdown(now, target.getTime());

  return (
    <div className="lid">
      <div
        className="lcd"
        role="timer"
        aria-label={`${days} dager, ${hours} timer, ${minutes} minutter, ${seconds} sekunder`}
      >
        <div className="lcd-row lcd-top">
          <span className="battery" aria-hidden="true" />
          <span className="lcd-group">
            <SevenSegment value={String(days)} className="big" />
            <span className="unit">Dager</span>
          </span>
        </div>
        <div className="lcd-row">
          <span className="lcd-group">
            <SevenSegment value={pad2(hours)} />
            <span className="unit">Timer</span>
          </span>
          <span className="lcd-group">
            <SevenSegment value={pad2(minutes)} />
            <span className="unit">Min</span>
          </span>
          <span className="lcd-group">
            <SevenSegment value={pad2(seconds)} />
            <span className="unit">Sek</span>
          </span>
        </div>
      </div>
      <div className="lid-latch" aria-hidden="true" />
    </div>
  );
}
