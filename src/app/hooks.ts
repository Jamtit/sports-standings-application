import type { RootState, AppDispatch } from "./store";
import { createSelector } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type {
  Participant,
  TournamentTypes,
} from "../features/tournaments/types/tournaments.types";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

const EMPTY_PARTICIPANTS: Participant[] = [];

const selectTournaments = (state: RootState) => state.tournaments.tournaments;

const selectTournamentTypes = createSelector(
  [selectTournaments],
  (tournaments) => Object.keys(tournaments) as TournamentTypes[],
);

const selectTournamentByType = (
  state: RootState,
  tournamentType: TournamentTypes,
) => state.tournaments.tournaments[tournamentType];

export const useTournamentTypes = () => {
  return useAppSelector(selectTournamentTypes);
};

export const useTournamentParticipants = (tournamentType: TournamentTypes) => {
  return useAppSelector(
    (state) => selectTournamentByType(state, tournamentType).participants,
  );
};

export const useSortedTournamentParticipants = (
  tournamentType: TournamentTypes,
) => {
  const participants = useTournamentParticipants(tournamentType);

  return useMemo(
    () =>
      [...participants].sort((participantA, participantB) => {
        const pointDifference =
          participantB.stats.points - participantA.stats.points;

        if (pointDifference !== 0) {
          return pointDifference;
        }

        return participantA.stats.name.localeCompare(participantB.stats.name);
      }),
    [participants],
  );
};

export const useTournamentMatches = (tournamentType: TournamentTypes) => {
  return useAppSelector(
    (state) => selectTournamentByType(state, tournamentType).matches,
  );
};

export type RecentTournamentMatch = {
  id: string;
  participantA: Participant;
  participantB: Participant;
  scoreA: number;
  scoreB: number;
};

export const useRecentTournamentMatches = (
  tournamentType: TournamentTypes,
  limit = 2,
) => {
  const participants = useTournamentParticipants(tournamentType);
  const matches = useTournamentMatches(tournamentType);

  return useMemo(() => {
    const participantById = new Map(
      participants.map((participant) => [participant.id, participant]),
    );

    return matches
      .slice(-limit)
      .reverse()
      .flatMap((match) => {
        const participantA = participantById.get(match.participantAId);
        const participantB = participantById.get(match.participantBId);

        if (!participantA || !participantB) {
          return [];
        }

        return [
          {
            id: match.id,
            participantA,
            participantB,
            scoreA: match.scoreA,
            scoreB: match.scoreB,
          },
        ];
      });
  }, [limit, matches, participants]);
};

export const useAvailableOpponents = (
  tournamentType: TournamentTypes,
  participantId: string,
) => {
  const participants = useTournamentParticipants(tournamentType);
  const matches = useTournamentMatches(tournamentType);

  return useMemo(() => {
    if (!participantId) {
      return EMPTY_PARTICIPANTS;
    }

    const playedOpponentIds = new Set(
      matches.flatMap((match) => {
        if (match.participantAId === participantId) {
          return [match.participantBId];
        }

        if (match.participantBId === participantId) {
          return [match.participantAId];
        }

        return [];
      }),
    );

    return participants.filter(
      (participant) =>
        participant.id !== participantId &&
        !playedOpponentIds.has(participant.id),
    );
  }, [matches, participantId, participants]);
};
