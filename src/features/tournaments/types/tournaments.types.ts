export type TournamentTypes = "premier-league" | "eurobasket" | "wimbledon";

export type Tournament = {
  type: TournamentTypes;
  name: string;
  participants: Participant[];
  matches: Match[];
  showDraws: boolean;
  showMatches: boolean;
};

export type Match = {
  id: string;
  participantA: Participant["name"];
  participantB: Participant["name"];
  scoreA: number;
  scoreB: number;
};

export type Participant = {
  id: string;
  name: string;
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
