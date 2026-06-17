import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { initialTournaments } from "../../constants/initialTournaments";
import { renderWithProviders } from "../../../../test/renderWithProviders";
import type {
  Match,
  Participant,
  TournamentTypes,
} from "../../types/tournaments.types";
import TournamentCard from "./TournamentCard";

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
  tournamentType,
}: {
  matches?: Match[];
  participants?: Participant[];
  tournamentType: TournamentTypes;
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

function renderTournamentCard({
  matches,
  participants,
  tournamentType,
}: {
  matches?: Match[];
  participants?: Participant[];
  tournamentType: TournamentTypes;
}) {
  return renderWithProviders(<TournamentCard tournamentType={tournamentType} />, {
    preloadedState: createPreloadedState({
      matches,
      participants,
      tournamentType,
    }),
  });
}

describe("TournamentCard", () => {
  it("renders the tournament title and score table", () => {
    renderTournamentCard({ tournamentType: "premier-league" });

    expect(
      screen.getByRole("heading", { name: "Premier League" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("No Team are added yet.")).toBeInTheDocument();
  });

  it("shows both action forms immediately when action forms are always visible", () => {
    renderTournamentCard({ tournamentType: "premier-league" });

    expect(screen.getByText("Add Team")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Add Score" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Team Name")).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")[0]).toHaveDisplayValue("Home Team");
  });

  it("uses player labels and play columns for player tournaments", async () => {
    const user = userEvent.setup();

    renderTournamentCard({ tournamentType: "wimbledon" });

    await user.click(screen.getByRole("button", { name: "Add Player" }));

    expect(screen.getByText("Add Player")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Player Name")).toBeInTheDocument();

    const columnHeaders = screen.getAllByRole("columnheader");

    expect(columnHeaders.map((header) => header.textContent)).toEqual([
      "Player",
      "M",
      "W",
      "L",
      "Pts",
    ]);
  });

  it("toggles action forms when they are not always visible", async () => {
    const user = userEvent.setup();
    const participants = [
      createParticipant({ country: "lt", id: "1", name: "Lithuania" }),
      createParticipant({ country: "es", id: "2", name: "Spain" }),
    ];

    renderTournamentCard({ participants, tournamentType: "eurobasket" });

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Add Score" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add Team" }));

    expect(screen.getByText("Add Team")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveDisplayValue("Country");

    await user.click(screen.getByRole("button", { name: "Add Score" }));

    expect(screen.getByRole("heading", { name: "Add Score" })).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("combobox")
        .some((combobox) => combobox.textContent?.includes("Home Team")),
    ).toBe(true);
  });

  it("disables the score action until at least two participants exist", () => {
    renderTournamentCard({
      participants: [createParticipant({ id: "1", name: "Novak Djokovic" })],
      tournamentType: "wimbledon",
    });

    expect(screen.getByRole("button", { name: "Add Score" })).toBeDisabled();
  });

  it("renders recent matches only when enabled by tournament config", () => {
    const participants = [
      createParticipant({ country: "lt", id: "1", name: "Lithuania" }),
      createParticipant({ country: "es", id: "2", name: "Spain" }),
    ];
    const matches = [createMatch("match-1", "1", "2", 82, 77)];

    renderTournamentCard({
      matches,
      participants,
      tournamentType: "eurobasket",
    });

    expect(screen.getByText("82 - 77")).toBeInTheDocument();
  });

  it("passes the optional table label to the table", () => {
    renderTournamentCard({ tournamentType: "eurobasket" });

    expect(
      screen.getByRole("heading", { name: "Score Table:" }),
    ).toBeInTheDocument();
  });

  it("does not render recent matches when disabled by tournament config", () => {
    const participants = [
      createParticipant({ id: "1", name: "Arsenal" }),
      createParticipant({ id: "2", name: "Chelsea" }),
    ];
    const matches = [createMatch("match-1", "1", "2", 2, 1)];

    renderTournamentCard({
      matches,
      participants,
      tournamentType: "premier-league",
    });

    const table = screen.getByRole("table");

    expect(screen.queryByText("2 - 1")).not.toBeInTheDocument();
    expect(within(table).getByText("Arsenal")).toBeInTheDocument();
  });
});
