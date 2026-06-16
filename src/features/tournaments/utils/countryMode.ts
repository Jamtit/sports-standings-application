import type { TournamentCountryMode } from "../types/tournaments.types";

export function usesCountries(countryMode: TournamentCountryMode): boolean {
  return countryMode !== "none";
}

export function shouldShowParticipantNameInput(
  countryMode: TournamentCountryMode,
): boolean {
  return countryMode !== "national-team";
}

export function isNationalTeamMode(
  countryMode: TournamentCountryMode,
): boolean {
  return countryMode === "national-team";
}
