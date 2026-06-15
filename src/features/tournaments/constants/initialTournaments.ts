import type { TournamentTypes, Tournament } from "../types/tournaments.types";

export const initialTournaments: Record<TournamentTypes, Tournament> = {
  "premier-league": {
    type: "premier-league",
    name: "Premier League",
    participants: [],
    matches: [],
    showDraws: true,
    showMatches: true,
  },
  eurobasket: {
    type: "eurobasket",
    name: "EuroBasket",
    participants: [],
    matches: [],
    showDraws: true,
    showMatches: false,
  },
  wimbledon: {
    type: "wimbledon",
    name: "Wimbledon",
    participants: [],
    matches: [],
    showDraws: false,
    showMatches: true,
  },
};
