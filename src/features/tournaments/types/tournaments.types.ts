import type { TOURNAMENT_ICONS } from "../constants/icons";

export type TournamentTypes = "premier-league" | "eurobasket" | "wimbledon";

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
  isParticipantAPlayer: boolean;
  isAMatch: boolean;
};

export type Match = {
  id: string;
  participantA: Participant["stats"]["name"];
  participantB: Participant["stats"]["name"];
  scoreA: number;
  scoreB: number;
};

export type Participant = {
  id: string;
  country?: string;
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
