import { describe, expect, it } from "vitest";
import {
  isNationalTeamMode,
  shouldShowParticipantNameInput,
  usesCountries,
} from "./countryMode";

describe("countryMode utilities", () => {
  describe("usesCountries", () => {
    it("returns false for tournaments without country support", () => {
      expect(usesCountries("none")).toBe(false);
    });

    it("returns true for participant country mode", () => {
      expect(usesCountries("participant-country")).toBe(true);
    });

    it("returns true for national team mode", () => {
      expect(usesCountries("national-team")).toBe(true);
    });
  });

  describe("shouldShowParticipantNameInput", () => {
    it("returns false for national team mode", () => {
      expect(shouldShowParticipantNameInput("national-team")).toBe(false);
    });

    it("returns true for participant country mode", () => {
      expect(shouldShowParticipantNameInput("participant-country")).toBe(true);
    });

    it("returns true when countries are not used", () => {
      expect(shouldShowParticipantNameInput("none")).toBe(true);
    });
  });

  describe("isNationalTeamMode", () => {
    it("returns true only for national team mode", () => {
      expect(isNationalTeamMode("national-team")).toBe(true);
      expect(isNationalTeamMode("participant-country")).toBe(false);
      expect(isNationalTeamMode("none")).toBe(false);
    });
  });
});
