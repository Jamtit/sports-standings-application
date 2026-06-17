import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { initialTournaments } from "../../constants/initialTournaments";
import { renderWithProviders } from "../../../../test/renderWithProviders";
import type {
  Match,
  Participant,
  TournamentTypes,
} from "../../types/tournaments.types";
import TournamentCardTable from "./TournamentCardTable";

function createParticipant({
  country,
  draws = 0,
  id,
  losses = 0,
  matchesPlayed = 0,
  name,
  points = 0,
  wins = 0,
}: {
  country?: Participant["country"];
  draws?: number;
  id: string;
  losses?: number;
  matchesPlayed?: number;
  name: string;
  points?: number;
  wins?: number;
}): Participant {
  return {
    id,
    country,
    stats: {
      participantId: id,
      name,
      matchesPlayed,
      wins,
      losses,
      draws,
      points,
    },
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

function renderTable({
  countryMode = "none",
  participantLabel = "Team",
  participants = [],
  playName = "M",
  showDraws = true,
  showMatches = true,
  showWinLossIcon = false,
  tableLabel,
  tournamentType = "premier-league",
}: Partial<React.ComponentProps<typeof TournamentCardTable>> & {
  participants?: Participant[];
} = {}) {
  return renderWithProviders(
    <TournamentCardTable
      countryMode={countryMode}
      participantLabel={participantLabel}
      playName={playName}
      showDraws={showDraws}
      showMatches={showMatches}
      showWinLossIcon={showWinLossIcon}
      tableLabel={tableLabel}
      tournamentType={tournamentType}
    />,
    {
      preloadedState: createPreloadedState({
        participants,
        tournamentType,
      }),
    },
  );
}

describe("TournamentCardTable", () => {
  it("renders an empty state when there are no participants", () => {
    renderTable();

    expect(screen.getByText("No Team are added yet.")).toBeInTheDocument();
  });

  it("renders a prompt when only one participant exists", () => {
    renderTable({
      participants: [createParticipant({ id: "1", name: "Arsenal" })],
    });

    expect(
      screen.getByText("Add 1 more team to start adding scores."),
    ).toBeInTheDocument();
  });

  it("renders columns based on visibility props", () => {
    renderTable({
      participantLabel: "Player",
      playName: "P",
      showDraws: false,
      showMatches: true,
    });

    const columnHeaders = screen.getAllByRole("columnheader");

    expect(columnHeaders.map((header) => header.textContent)).toEqual([
      "Player",
      "P",
      "W",
      "L",
      "Pts",
    ]);
    expect(screen.queryByRole("columnheader", { name: "D" })).not.toBeInTheDocument();
  });

  it("renders participants sorted by points and then name", () => {
    renderTable({
      participants: [
        createParticipant({ id: "1", name: "Spain", points: 3 }),
        createParticipant({ id: "2", name: "France", points: 6 }),
        createParticipant({ id: "3", name: "Germany", points: 3 }),
      ],
    });

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row").slice(1);

    expect(rows.map((row) => within(row).getAllByRole("cell")[0].textContent)).toEqual([
      "France",
      "Germany",
      "Spain",
    ]);
  });

  it("renders participant flags when country mode uses countries", () => {
    renderTable({
      countryMode: "national-team",
      participants: [
        createParticipant({
          country: "lt",
          id: "1",
          name: "Lithuania",
        }),
      ],
      tournamentType: "eurobasket",
    });

    expect(
      screen.getByRole("img", { name: "Lithuania flag" }),
    ).toBeInTheDocument();
  });

  it("renders win and loss icons when enabled", () => {
    renderTable({
      participants: [
        createParticipant({
          id: "1",
          losses: 1,
          name: "Player One",
          wins: 2,
        }),
      ],
      showWinLossIcon: true,
    });

    const row = screen.getByRole("row", { name: /Player One/i });

    expect(row.querySelector(".tournament-card-table__table__body__win-column__tick-icon")).toBeInTheDocument();
    expect(row.querySelector(".tournament-card-table__table__body__loss-column__x-icon")).toBeInTheDocument();
  });

  it("renders an optional table label", () => {
    renderTable({ tableLabel: "Score Table:" });

    expect(
      screen.getByRole("heading", { name: "Score Table:" }),
    ).toBeInTheDocument();
  });
});
