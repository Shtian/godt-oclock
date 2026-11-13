// Segments in order a, b, c, d, e, f, g (clockwise from top, g = middle).
const DIGIT_SEGMENTS: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abdeg",
  "3": "abcdg",
  "4": "bcfg",
  "5": "acdfg",
  "6": "acdefg",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
};

// Upright segment geometry in a 50x90 box; the SVG skews it for the LCD slant.
const T = 8; // segment thickness
const H = T / 2;

function horizontal(y: number): string {
  const [x1, x2] = [5, 45];
  return `M${x1} ${y} L${x1 + H} ${y - H} L${x2 - H} ${y - H} L${x2} ${y} L${x2 - H} ${y + H} L${x1 + H} ${y + H} Z`;
}

function vertical(x: number, y1: number, y2: number): string {
  return `M${x} ${y1} L${x + H} ${y1 + H} L${x + H} ${y2 - H} L${x} ${y2} L${x - H} ${y2 - H} L${x - H} ${y1 + H} Z`;
}

const SEGMENT_PATHS: Record<string, string> = {
  a: horizontal(4),
  b: vertical(46, 5, 44),
  c: vertical(46, 46, 85),
  d: horizontal(86),
  e: vertical(4, 46, 85),
  f: vertical(4, 5, 44),
  g: horizontal(45),
};

interface DigitProps {
  char: string;
}

function Digit({ char }: DigitProps) {
  const on = DIGIT_SEGMENTS[char] ?? "";
  return (
    <svg className="digit" viewBox="0 0 60 90" aria-hidden="true">
      <g transform="translate(10 0) skewX(-6)">
        {Object.entries(SEGMENT_PATHS).map(([seg, d]) => (
          <path key={seg} d={d} className={on.includes(seg) ? "seg on" : "seg"} />
        ))}
      </g>
    </svg>
  );
}

interface SevenSegmentProps {
  value: string;
  className?: string;
}

export function SevenSegment({ value, className }: SevenSegmentProps) {
  return (
    <span className={`seven ${className ?? ""}`} role="img" aria-label={value}>
      {value.split("").map((char, i) => (
        <Digit key={i} char={char} />
      ))}
    </span>
  );
}
