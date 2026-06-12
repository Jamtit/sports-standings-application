export type TournamentTypes = "premier-league" | "eurobasket" | "wimbledon";

export type Tournament = {
  type: TournamentTypes;
  name: string;
  participants: number;
  matches: Match[];
};

export type Match = {
  id: string;
  participantA: string;
  participantB: string;
  scoreA: number;
  scoreB: number;
};
