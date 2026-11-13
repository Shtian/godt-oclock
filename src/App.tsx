import { useMemo, useState } from "react";
import { JarDisplay } from "./components/JarDisplay";
import { useNow } from "./hooks/useNow";
import {
  DEFAULT_HOUR,
  addDays,
  DEFAULT_MINUTE,
  atTime,
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

function formatTarget(date: Date): string {
  const day = date.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  return `${day} at ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export default function App() {
  const [opened] = useState(() => new Date());
  const defaultTarget = useMemo(() => nextOccurrence(opened), [opened]);

  const [step, setStep] = useState<Step>("day");
  const [day, setDay] = useState<Date>(() => startOfDay(defaultTarget));
  const [hour, setHour] = useState(DEFAULT_HOUR);
  const [minute, setMinute] = useState(DEFAULT_MINUTE);

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
            aria-label="Back"
          >
            ‹
          </button>
        ) : (
          <span className="back-spacer" />
        )}
        <h1>Candy Timer</h1>
        <ol className="dots" aria-label={`Step ${STEPS.indexOf(step) + 1} of 3`}>
          {STEPS.map((s) => (
            <li key={s} className={s === step ? "active" : ""} />
          ))}
        </ol>
      </header>

      {step === "day" && (
        <section className="step">
          <h2>When should it unlock?</h2>
          <button type="button" className="hero-choice" onClick={useDefault}>
            <span className="hero-label">Usual time</span>
            <span className="hero-value">{formatTarget(defaultTarget)}</span>
            <span className="hero-go">Show countdown →</span>
          </button>

          <p className="or">or pick a day</p>
          <div className="day-grid">
            {days.map((d) => (
              <button
                type="button"
                key={d.toISOString()}
                className={`chip day-chip ${isSameDay(d, day) ? "selected" : ""}`}
                onClick={() => pickDay(d)}
              >
                <span className="chip-main">{dayLabel(d, opened)}</span>
                <span className="chip-sub">
                  {d.toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === "time" && (
        <section className="step">
          <h2>
            What time{" "}
            {isSameDay(day, opened) || isSameDay(day, addDays(startOfDay(opened), 1))
              ? dayLabel(day, opened).toLowerCase()
              : `on ${dayLabel(day, opened)}`}
            ?
          </h2>

          <div className="time-picker">
            <div className="spinner">
              <button type="button" onClick={() => stepHour(1)} aria-label="Hour up">
                ▲
              </button>
              <output aria-label="Hour">{pad2(hour)}</output>
              <button type="button" onClick={() => stepHour(-1)} aria-label="Hour down">
                ▼
              </button>
            </div>
            <span className="colon">:</span>
            <div className="spinner">
              <button type="button" onClick={() => stepMinute(15)} aria-label="Minutes up">
                ▲
              </button>
              <output aria-label="Minutes">{pad2(minute)}</output>
              <button type="button" onClick={() => stepMinute(-15)} aria-label="Minutes down">
                ▼
              </button>
            </div>
          </div>

          <div className="quick-times">
            {QUICK_TIMES.map(([h, m]) => (
              <button
                type="button"
                key={`${h}:${m}`}
                className={`chip ${h === hour && m === minute ? "selected" : ""}`}
                onClick={() => {
                  setHour(h);
                  setMinute(m);
                }}
              >
                {pad2(h)}:{pad2(m)}
              </button>
            ))}
          </div>

          {inPast && <p className="warn">That time has already passed — pick a later one.</p>}

          <button
            type="button"
            className="primary"
            disabled={inPast}
            onClick={() => setStep("result")}
          >
            Show countdown
          </button>
        </section>
      )}

      {step === "result" && (
        <section className="step result">
          <h2>Set the jar to</h2>
          <JarDisplay target={target} />
          <p className="unlocks">
            Unlocks <strong>{formatTarget(target)}</strong>
          </p>
          <div className="actions">
            <button type="button" className="secondary" onClick={() => setStep("time")}>
              Change time
            </button>
            <button type="button" className="secondary" onClick={() => setStep("day")}>
              Start over
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
