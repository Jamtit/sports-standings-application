import {
  type TournamentTypes,
  type Tournament,
} from "../types/tournaments.types";

export const initialTournaments: Record<TournamentTypes, Tournament> = {
  "premier-league": {
    type: "premier-league",
    name: "Premier League",
    participants: [],
    matches: [],
  },
  eurobasket: {
    type: "eurobasket",
    name: "EuroBasket",
    participants: [],
    matches: [],
  },
  wimbledon: {
    type: "wimbledon",
    name: "Wimbledon",
    participants: [],
    matches: [],
  },
};
