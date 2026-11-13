import { useEffect, useMemo, useRef, useState } from "react";
import { JarDisplay } from "./components/JarDisplay";
import { useNow } from "./hooks/useNow";
import {
  DEFAULT_HOUR,
  addDays,
  DEFAULT_MINUTE,
  atTime,
  capitalize,
  LOCALE,
  dayLabel,
  dayOptions,
  isSameDay,
  nextOccurrence,
  pad2,
  startOfDay,
} from "./lib/time";

type Step = "day" | "time" | "result";

const QUICK_TIMES: [number, number][] = [
  [8, 0],
  [12, 0],
  [14, 0],
  [16, 0],
  [18, 0],
  [20, 0],
];

const STEPS: Step[] = ["day", "time", "result"];

/** Each chip gets its own candy colour, cycling through the bag. */
const CANDY = ["mint", "lemon", "lavender", "peach", "sky", "rose"] as const;
const candy = (i: number) => `candy-${CANDY[i % CANDY.length]}`;

function formatTarget(date: Date): string {
  const day = date.toLocaleDateString(LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  return `${day} kl. ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export default function App() {
  const [opened] = useState(() => new Date());
  const defaultTarget = useMemo(() => nextOccurrence(opened), [opened]);

  const [step, setStep] = useState<Step>("day");
  const [day, setDay] = useState<Date>(() => startOfDay(defaultTarget));
  const [hour, setHour] = useState(DEFAULT_HOUR);
  const [minute, setMinute] = useState(DEFAULT_MINUTE);

  // Move focus to the new step's heading so keyboard and screen reader users follow along.
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
  }, [step]);

  const target = atTime(day, hour, minute);
  const now = useNow();
  const inPast = target.getTime() <= now;
  const days = dayOptions(opened);

  const pickDay = (d: Date) => {
    setDay(d);
    setStep("time");
  };

  const useDefault = () => {
    setDay(startOfDay(defaultTarget));
    setHour(DEFAULT_HOUR);
    setMinute(DEFAULT_MINUTE);
    setStep("result");
  };

  const stepHour = (delta: number) => setHour((h) => (h + delta + 24) % 24);
  const stepMinute = (delta: number) => setMinute((m) => (m + delta + 60) % 60);

  return (
    <main className="app">
      <header className="top">
        {step !== "day" ? (
          <button
            type="button"
            className="back"
            onClick={() => setStep(step === "result" ? "time" : "day")}
            aria-label="Tilbake"
          >
            ‹
          </button>
        ) : (
          <span className="back-spacer" aria-hidden="true" />
        )}
        <h1>Godt o'clock</h1>
        <p className="dots">
          <span className="sr-only">{`Steg ${STEPS.indexOf(step) + 1} av 3`}</span>
          {STEPS.map((s) => (
            <span key={s} className={s === step ? "dot active" : "dot"} aria-hidden="true" />
          ))}
        </p>
      </header>

      {step === "day" && (
        <section className="step">
          <h2 ref={heading} tabIndex={-1}>
            Når skal boksen åpnes?
          </h2>
          <button type="button" className="hero-choice" onClick={useDefault}>
            <span className="hero-value">{capitalize(formatTarget(defaultTarget))}</span>
            <span className="hero-go">Bruk vanlig tid →</span>
          </button>

          <p className="or">eller velg en dag</p>
          <div className="day-grid">
            {days.map((d, i) => (
              <button
                type="button"
                key={d.toISOString()}
                className={`chip day-chip ${candy(i)}`}
                aria-pressed={isSameDay(d, day)}
                onClick={() => pickDay(d)}
              >
                <span className="chip-main">{dayLabel(d, opened)}</span>
                <span className="chip-sub">
                  {d.toLocaleDateString(LOCALE, { day: "numeric", month: "short" })}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === "time" && (
        <section className="step">
          <h2 ref={heading} tabIndex={-1}>
            Hvilken tid{" "}
            {isSameDay(day, opened) || isSameDay(day, addDays(startOfDay(opened), 1))
              ? dayLabel(day, opened).toLowerCase()
              : `på ${dayLabel(day, opened).toLowerCase()}`}
            ?
          </h2>

          <div className="time-picker">
            <div className="spinner">
              <button type="button" onClick={() => stepHour(1)} aria-label="Time opp">
                ▲
              </button>
              <output aria-label="Time">{pad2(hour)}</output>
              <button type="button" onClick={() => stepHour(-1)} aria-label="Time ned">
                ▼
              </button>
            </div>
            <span className="colon">:</span>
            <div className="spinner">
              <button type="button" onClick={() => stepMinute(15)} aria-label="Minutter opp">
                ▲
              </button>
              <output aria-label="Minutter">{pad2(minute)}</output>
              <button type="button" onClick={() => stepMinute(-15)} aria-label="Minutter ned">
                ▼
              </button>
            </div>
          </div>

          <div className="quick-times">
            {QUICK_TIMES.map(([h, m], i) => (
              <button
                type="button"
                key={`${h}:${m}`}
                className={`chip ${candy(i + 2)}`}
                aria-pressed={h === hour && m === minute}
                onClick={() => {
                  setHour(h);
                  setMinute(m);
                }}
              >
                {pad2(h)}:{pad2(m)}
              </button>
            ))}
          </div>

          <p className="warn" aria-live="polite">
            {inPast ? "Det tidspunktet har allerede vært. Velg et senere." : ""}
          </p>

          <button
            type="button"
            className="primary"
            disabled={inPast}
            onClick={() => setStep("result")}
          >
            Vis nedtelling
          </button>
        </section>
      )}

      {step === "result" && (
        <section className="step result">
          <h2 ref={heading} tabIndex={-1}>
            Still inn boksen på
          </h2>
          <JarDisplay target={target} />
          <p className="unlocks">
            Åpnes <strong>{formatTarget(target)}</strong>
          </p>
          <div className="actions">
            <button type="button" className="secondary" onClick={() => setStep("time")}>
              Endre tid
            </button>
            <button type="button" className="secondary" onClick={() => setStep("day")}>
              Start på nytt
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
