import { describe, expect, it } from "vitest";
import { formatParticipantName } from "./formatParticipantName";

describe("formatParticipantName", () => {
  it("trims surrounding whitespace", () => {
    expect(formatParticipantName("  lithuania  ")).toBe("Lithuania");
  });

  it("collapses multiple spaces between words", () => {
    expect(formatParticipantName("real    madrid")).toBe("Real Madrid");
  });

  it("title-cases every word", () => {
    expect(formatParticipantName("new york knicks")).toBe("New York Knicks");
  });

  it("keeps already formatted names stable", () => {
    expect(formatParticipantName("Spain")).toBe("Spain");
  });

  it("returns an empty string for whitespace-only input", () => {
    expect(formatParticipantName("   ")).toBe("");
  });
});
