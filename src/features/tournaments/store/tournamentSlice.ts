import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialTournaments } from "../constants/initialTournaments";
import type {
  Participant,
  Match,
  TournamentTypes,
  ParticipantStats,
} from "../types/tournaments.types";

type TournamentState = {
  tournaments: typeof initialTournaments;
};

const initialState: TournamentState = {
  tournaments: initialTournaments,
};

function participantStatsBuilder({
  participantId,
  name,
  matchesPlayed,
  wins,
  losses,
  draws,
  points,
}: ParticipantStats): ParticipantStats {
  return {
    participantId: participantId,
    name: name,
    matchesPlayed: matchesPlayed,
    wins: wins,
    losses: losses,
    draws: draws,
    points: points,
  };
}

const tournamentSlice = createSlice({
  name: "tournaments",
  initialState,
  reducers: {
    addParticipant: (
      state,
      action: PayloadAction<{
        tournamentType: TournamentTypes;
        participantName: string;
      }>,
    ) => {
      const { tournamentType, participantName } = action.payload;
      const participantId = crypto.randomUUID();
      const stats: ParticipantStats = participantStatsBuilder({
        participantId: participantId,
        name: participantName,
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        points: 0,
      });

      const participant: Participant = {
        id: participantId,
        stats: stats,
      };

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
