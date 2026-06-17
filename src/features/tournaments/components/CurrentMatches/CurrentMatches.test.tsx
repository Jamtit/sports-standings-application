import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { initialTournaments } from "../../constants/initialTournaments";
import { renderWithProviders } from "../../../../test/renderWithProviders";
import type {
  Match,
  Participant,
  TournamentCountryMode,
  TournamentTypes,
} from "../../types/tournaments.types";
import CurrentMatches from "./CurrentMatches";

function createParticipant({
  country,
  id,
  name,
}: {
  country?: Participant["country"];
  id: string;
  name: string;
}): Participant {
  return {
    id,
    country,
    stats: {
      participantId: id,
      name,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      points: 0,
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
  tournamentType = "eurobasket",
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

function renderCurrentMatches({
  countryMode = "national-team",
  matches = [],
  participants = [],
  tournamentType = "eurobasket",
}: {
  countryMode?: TournamentCountryMode;
  matches?: Match[];
  participants?: Participant[];
  tournamentType?: TournamentTypes;
}) {
  return renderWithProviders(
    <CurrentMatches countryMode={countryMode} tournamentType={tournamentType} />,
    {
      preloadedState: createPreloadedState({
        matches,
        participants,
        tournamentType,
      }),
    },
  );
}

describe("CurrentMatches", () => {
  it("renders nothing when there are no matches", () => {
    const { container } = renderCurrentMatches({});

    expect(container).toBeEmptyDOMElement();
  });

  it("renders only the latest two matches", () => {
    const participants = [
      createParticipant({ id: "1", name: "Lithuania" }),
      createParticipant({ id: "2", name: "Spain" }),
      createParticipant({ id: "3", name: "France" }),
      createParticipant({ id: "4", name: "Germany" }),
    ];
    const matches = [
      createMatch("match-1", "1", "2", 80, 75),
      createMatch("match-2", "3", "4", 71, 71),
      createMatch("match-3", "2", "3", 90, 88),
    ];

    renderCurrentMatches({ matches, participants });

    expect(screen.queryByText("Lithuania")).not.toBeInTheDocument();
    expect(screen.queryByText("80 - 75")).not.toBeInTheDocument();
    expect(screen.getByText("Germany")).toBeInTheDocument();
    expect(screen.getByText("Spain")).toBeInTheDocument();
    expect(screen.getByText("90 - 88")).toBeInTheDocument();
  });

  it("renders the newest match first", () => {
    const participants = [
      createParticipant({ id: "1", name: "Lithuania" }),
      createParticipant({ id: "2", name: "Spain" }),
      createParticipant({ id: "3", name: "France" }),
    ];
    const matches = [
      createMatch("match-1", "1", "2", 80, 75),
      createMatch("match-2", "2", "3", 71, 71),
      createMatch("match-3", "3", "1", 90, 88),
    ];

    renderCurrentMatches({ matches, participants });

    expect(screen.getAllByText("vs").map((element) => element.parentElement?.textContent)).toEqual([
      "FrancevsLithuania",
      "SpainvsFrance",
    ]);
  });

  it("renders participant flags when country mode uses countries", () => {
    const participants = [
      createParticipant({ country: "lt", id: "1", name: "Lithuania" }),
      createParticipant({ country: "es", id: "2", name: "Spain" }),
    ];
    const matches = [createMatch("match-1", "1", "2", 80, 75)];

    renderCurrentMatches({ matches, participants });

    expect(
      screen.getByRole("img", { name: "Lithuania flag" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Spain flag" })).toBeInTheDocument();
  });

  it("omits participant flags when country mode does not use countries", () => {
    const participants = [
      createParticipant({ country: "lt", id: "1", name: "Lithuania" }),
      createParticipant({ country: "es", id: "2", name: "Spain" }),
    ];
    const matches = [createMatch("match-1", "1", "2", 80, 75)];

    renderCurrentMatches({
      countryMode: "none",
      matches,
      participants,
    });

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
