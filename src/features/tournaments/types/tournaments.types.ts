import type { TOURNAMENT_ICONS } from "../constants/icons";
import type { CountryCode } from "../../../shared/constants/countries";

export type TournamentTypes = "premier-league" | "eurobasket" | "wimbledon";
export type TournamentCountryMode = "none" | "participant-country" | "national-team";

export type Tournament = {
  type: TournamentTypes;
  name: string;
  participants: Participant[];
  matches: Match[];
  iconName: keyof typeof TOURNAMENT_ICONS | "";
  showDraws: boolean;
  showMatches: boolean;
  showWinLossIcons: boolean;
  showActionForms: boolean;
  countryMode: TournamentCountryMode;
  isParticipantAPlayer: boolean;
  isAMatch: boolean;
};

export type Match = {
  id: string;
  participantAId: Participant["id"];
  participantBId: Participant["id"];
  scoreA: number;
  scoreB: number;
};

export type Participant = {
  id: string;
  country?: CountryCode;
  stats: ParticipantStats;
};

export type ParticipantStats = {
  participantId: string;
  name: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
};
