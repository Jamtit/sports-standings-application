import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialTournaments } from "../constants/initialTournaments";
import type {
  Participant,
  Match,
  TournamentTypes,
  ParticipantStats,
} from "../types/tournaments.types";
import {
  isCountryCode,
  type CountryCode,
} from "../../../shared/constants/countries";

export type TournamentState = {
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

function matchKey(participantAId: string, participantBId: string): string {
  return [participantAId, participantBId].sort().join(":");
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

function hasMatchAlreadyBeenPlayed(
  matches: Match[],
  participantAId: string,
  participantBId: string,
): boolean {
  const nextMatchKey = matchKey(participantAId, participantBId);

  return matches.some(
    (match) => matchKey(match.participantAId, match.participantBId) === nextMatchKey,
  );
}

function applyMatchResult(
  participantAStats: ParticipantStats,
  participantBStats: ParticipantStats,
  scoreA: number,
  scoreB: number,
) {
  participantAStats.matchesPlayed += 1;
  participantBStats.matchesPlayed += 1;

  if (scoreA > scoreB) {
    participantAStats.wins += 1;
    participantAStats.points += 3;
    participantBStats.losses += 1;
    return;
  }

  if (scoreB > scoreA) {
    participantBStats.wins += 1;
    participantBStats.points += 3;
    participantAStats.losses += 1;
    return;
  }

  participantAStats.draws += 1;
  participantAStats.points += 1;
  participantBStats.draws += 1;
  participantBStats.points += 1;
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
        country?: CountryCode;
      }>,
    ) => {
      const { tournamentType, participantName, country } = action.payload;
      const tournament = state.tournaments[tournamentType];

      if (country && !isCountryCode(country)) {
        return;
      }

      const participantNameAlreadyExists = tournament.participants.some(
        (participant) =>
          normalizeName(participant.stats.name) === normalizeName(participantName),
      );

      if (!participantName.trim() || participantNameAlreadyExists) {
        return;
      }

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
        country,
        stats: stats,
      };

      tournament.participants.push(participant);
    },
    addMatch: (
      state,
      action: PayloadAction<{
        tournamentType: TournamentTypes;
        match: Match;
      }>,
    ) => {
      const { tournamentType, match } = action.payload;
      const tournament = state.tournaments[tournamentType];
      const participantA = tournament.participants.find(
        (participant) => participant.id === match.participantAId,
      );
      const participantB = tournament.participants.find(
        (participant) => participant.id === match.participantBId,
      );

      if (
        !participantA ||
        !participantB ||
        participantA.id === participantB.id ||
        hasMatchAlreadyBeenPlayed(
          tournament.matches,
          match.participantAId,
          match.participantBId,
        )
      ) {
        return;
      }

      tournament.matches.push(match);
      applyMatchResult(
        participantA.stats,
        participantB.stats,
        match.scoreA,
        match.scoreB,
      );
    },
  },
});

export const { addParticipant, addMatch } = tournamentSlice.actions;
export default tournamentSlice.reducer;
