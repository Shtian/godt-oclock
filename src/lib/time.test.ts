import { describe, expect, it } from "vite-plus/test";
import { countdown, dayOptions, nextOccurrence } from "./time";

// Months are 0-based: 10 = November. 2026-11-13 is a Friday.
describe("nextOccurrence (default Friday 14:00)", () => {
  it("returns today when it is Friday before 14:00", () => {
    const now = new Date(2026, 10, 13, 9, 30);
    expect(nextOccurrence(now)).toEqual(new Date(2026, 10, 13, 14, 0));
  });

  it("skips to next week when it is Friday after 14:00", () => {
    const now = new Date(2026, 10, 13, 14, 0, 1);
    expect(nextOccurrence(now)).toEqual(new Date(2026, 10, 20, 14, 0));
  });

  it("finds the coming Friday from a Saturday", () => {
    const now = new Date(2026, 10, 14, 20, 0);
    expect(nextOccurrence(now)).toEqual(new Date(2026, 10, 20, 14, 0));
  });

  it("crosses month boundaries", () => {
    const now = new Date(2026, 10, 30, 12, 0); // Monday
    expect(nextOccurrence(now)).toEqual(new Date(2026, 11, 4, 14, 0));
  });
});

describe("countdown", () => {
  it("splits into days, hours, minutes and seconds", () => {
    const from = new Date(2026, 10, 13, 7, 39, 12).getTime();
    const to = new Date(2026, 10, 13, 14, 0).getTime();
    expect(countdown(from, to)).toEqual({ days: 0, hours: 6, minutes: 20, seconds: 48 });
  });

  it("counts whole days", () => {
    const from = new Date(2026, 10, 14, 14, 0).getTime();
    const to = new Date(2026, 10, 20, 15, 1, 1).getTime();
    expect(countdown(from, to)).toEqual({ days: 6, hours: 1, minutes: 1, seconds: 1 });
  });

  it("clamps past targets to zero", () => {
    expect(countdown(1000, 0)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});

describe("dayOptions", () => {
  it("starts today at midnight and covers a week ahead", () => {
    const days = dayOptions(new Date(2026, 10, 13, 22, 15));
    expect(days).toHaveLength(8);
    expect(days[0]).toEqual(new Date(2026, 10, 13));
    expect(days[7]).toEqual(new Date(2026, 10, 20));
  });
});
