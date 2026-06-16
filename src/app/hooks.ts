import type { RootState, AppDispatch } from "./store";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { TournamentTypes } from "../features/tournaments/types/tournaments.types";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useTournamentTypes = () => {
  return useAppSelector(
    (state) => Object.keys(state.tournaments.tournaments) as TournamentTypes[],
  );
};

export const useTournamentParticipants = (tournamentType: TournamentTypes) => {
  return useAppSelector(
    (state) => state.tournaments.tournaments[tournamentType].participants,
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
    (state) => state.tournaments.tournaments[tournamentType].matches,
  );
};

export const useAvailableOpponents = (
  tournamentType: TournamentTypes,
  participantId: string,
) => {
  const participants = useTournamentParticipants(tournamentType);
  const matches = useTournamentMatches(tournamentType);

  return useMemo(() => {
    if (!participantId) {
      return [];
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
        participant.id !== participantId && !playedOpponentIds.has(participant.id),
    );
  }, [matches, participantId, participants]);
};
