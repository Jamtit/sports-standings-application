import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test/renderWithProviders";
import { initialTournaments } from "../features/tournaments/constants/initialTournaments";
import type {
  Match,
  Participant,
  TournamentTypes,
} from "../features/tournaments/types/tournaments.types";
import {
  useAvailableOpponents,
  useRecentTournamentMatches,
  useSortedTournamentParticipants,
  useTournamentTypes,
} from "./hooks";

function createParticipant(
  id: string,
  name: string,
  points: number,
): Participant {
  return {
    id,
    stats: {
      participantId: id,
      name,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      points,
    },
  };
}

function createMatch(
  id: string,
  participantAId: string,
  participantBId: string,
  scoreA: number,
  scoreB: number,
): Match {
  return {
    id,
    participantAId,
    participantBId,
    scoreA,
    scoreB,
  };
}

function createPreloadedState({
  matches = [],
  participants = [],
  tournamentType = "premier-league",
}: {
  matches?: Match[];
  participants?: Participant[];
  tournamentType?: TournamentTypes;
}) {
  const tournaments = structuredClone(initialTournaments);

  tournaments[tournamentType].participants = participants;
  tournaments[tournamentType].matches = matches;

  return {
    tournaments: {
      tournaments,
    },
  };
}

describe("app hooks", () => {
  it("returns tournament types", () => {
    function TestComponent() {
      const tournamentTypes = useTournamentTypes();

      return <div>{tournamentTypes.join(",")}</div>;
    }

    renderWithProviders(<TestComponent />);

    expect(
      screen.getByText("premier-league,eurobasket,wimbledon"),
    ).toBeInTheDocument();
  });

  it("returns participants sorted by points and then name", () => {
    const participants = [
      createParticipant("1", "Spain", 3),
      createParticipant("2", "France", 6),
      createParticipant("3", "Germany", 3),
    ];

    function TestComponent() {
      const sortedParticipants =
        useSortedTournamentParticipants("premier-league");

      return (
        <ol>
          {sortedParticipants.map((participant) => (
            <li key={participant.id}>{participant.stats.name}</li>
          ))}
        </ol>
      );
    }

    renderWithProviders(<TestComponent />, {
      preloadedState: createPreloadedState({ participants }),
    });

    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "France",
      "Germany",
      "Spain",
    ]);
  });

  it("returns available opponents excluding the selected participant and played opponents", () => {
    const participants = [
      createParticipant("1", "Lithuania", 0),
      createParticipant("2", "Spain", 0),
      createParticipant("3", "France", 0),
    ];
    const matches = [createMatch("match-1", "1", "2", 80, 75)];

    function TestComponent() {
      const opponents = useAvailableOpponents("premier-league", "1");

      return (
        <ul>
          {opponents.map((participant) => (
            <li key={participant.id}>{participant.stats.name}</li>
          ))}
        </ul>
      );
    }

    renderWithProviders(<TestComponent />, {
      preloadedState: createPreloadedState({ matches, participants }),
    });

    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "France",
    ]);
  });

  it("returns an empty opponent list when no participant is selected", () => {
    const participants = [
      createParticipant("1", "Lithuania", 0),
      createParticipant("2", "Spain", 0),
    ];

    function TestComponent() {
      const opponents = useAvailableOpponents("premier-league", "");

      return <div>{opponents.length}</div>;
    }

    renderWithProviders(<TestComponent />, {
      preloadedState: createPreloadedState({ participants }),
    });

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("returns the newest recent matches first with participant data", () => {
    const participants = [
      createParticipant("1", "Lithuania", 0),
      createParticipant("2", "Spain", 0),
      createParticipant("3", "France", 0),
    ];
    const matches = [
      createMatch("match-1", "1", "2", 80, 75),
      createMatch("match-2", "2", "3", 71, 71),
      createMatch("match-3", "3", "1", 90, 88),
    ];

    function TestComponent() {
      const recentMatches = useRecentTournamentMatches("premier-league");

      return (
        <ul>
          {recentMatches.map((match) => (
            <li key={match.id}>
              {match.participantA.stats.name} {match.scoreA}-{match.scoreB}{" "}
              {match.participantB.stats.name}
            </li>
          ))}
        </ul>
      );
    }

    renderWithProviders(<TestComponent />, {
      preloadedState: createPreloadedState({ matches, participants }),
    });

    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "France 90-88 Lithuania",
      "Spain 71-71 France",
    ]);
  });
});
