import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialTournaments } from "../constants/initialTournaments";
import type {
  Participant,
  Match,
  TournamentTypes,
} from "../types/tournaments.types";

type TournamentState = {
  tournaments: typeof initialTournaments;
};

const initialState: TournamentState = {
  tournaments: initialTournaments,
};

const tournamentSlice = createSlice({
  name: "tournaments",
  initialState,
  reducers: {
    addParticipant: (
      state,
      action: PayloadAction<{
        tournamentType: TournamentTypes;
        participant: Participant;
      }>,
    ) => {
      const { tournamentType, participant } = action.payload;
      state.tournaments[tournamentType].participants.push(participant);
    },
    addMatch: (
      state,
      action: PayloadAction<{
        tournamentType: TournamentTypes;
        match: Match;
      }>,
    ) => {
      const { tournamentType, match } = action.payload;
      state.tournaments[tournamentType].matches.push(match);
    },
  },
});

export const { addParticipant, addMatch } = tournamentSlice.actions;
export default tournamentSlice.reducer;
