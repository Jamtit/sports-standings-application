import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { initialTournaments } from "../../constants/initialTournaments";
import { renderWithProviders } from "../../../../test/renderWithProviders";
import type {
  Participant,
  TournamentCountryMode,
  TournamentTypes,
} from "../../types/tournaments.types";
import AddTeamForm from "./AddTeamForm";

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

function createPreloadedState({
  participants = [],
  tournamentType = "premier-league",
}: {
  participants?: Participant[];
  tournamentType?: TournamentTypes;
} = {}) {
  const tournaments = structuredClone(initialTournaments);

  tournaments[tournamentType].participants = participants;

  return {
    tournaments: {
      tournaments,
    },
  };
}

function renderAddTeamForm({
  countryMode = "none",
  participantLabel = "Team",
  participants = [],
  showActionForms = true,
  showForm = vi.fn(),
  tournamentType = "premier-league",
}: Partial<React.ComponentProps<typeof AddTeamForm>> & {
  participants?: Participant[];
} = {}) {
  return renderWithProviders(
    <AddTeamForm
      countryMode={countryMode as TournamentCountryMode}
      participantLabel={participantLabel}
      showActionForms={showActionForms}
      showForm={showForm}
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

describe("AddTeamForm", () => {
  it("keeps submit disabled until a regular participant name is entered", async () => {
    const user = userEvent.setup();

    renderAddTeamForm();

    const nameInput = screen.getByPlaceholderText("Team Name");
    const submitButton = screen.getByRole("button", { name: "Add" });

    expect(submitButton).toBeDisabled();

    await user.type(nameInput, "arsenal");

    expect(submitButton).toBeEnabled();
  });

  it("adds a regular participant with a formatted name", async () => {
    const user = userEvent.setup();
    const { store } = renderAddTeamForm();

    await user.type(screen.getByPlaceholderText("Team Name"), "real madrid");
    await user.click(screen.getByRole("button", { name: "Add" }));

    const participants =
      store.getState().tournaments.tournaments["premier-league"].participants;

    expect(participants).toHaveLength(1);
    expect(participants[0].stats.name).toBe("Real Madrid");
    expect(participants[0].country).toBeUndefined();
  });

  it("renders only a country select for national team tournaments", async () => {
    const user = userEvent.setup();
    const { store } = renderAddTeamForm({
      countryMode: "national-team",
      showActionForms: false,
      tournamentType: "eurobasket",
    });

    expect(screen.queryByPlaceholderText("Team Name")).not.toBeInTheDocument();

    const countrySelect = screen.getByRole("combobox");
    const submitButton = screen.getByRole("button", { name: "Add" });

    expect(submitButton).toBeDisabled();

    await user.selectOptions(countrySelect, "lt");

    expect(submitButton).toBeEnabled();

    await user.click(submitButton);

    const participants =
      store.getState().tournaments.tournaments.eurobasket.participants;

    expect(participants).toHaveLength(1);
    expect(participants[0].stats.name).toBe("Lithuania");
    expect(participants[0].country).toBe("lt");
  });

  it("renders both name input and country select for participant country mode", () => {
    renderAddTeamForm({
      countryMode: "participant-country",
      participantLabel: "Player",
      tournamentType: "wimbledon",
    });

    expect(screen.getByPlaceholderText("Player Name")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveDisplayValue("Country");
  });

  it("shows a duplicate participant warning", async () => {
    const user = userEvent.setup();

    renderAddTeamForm({
      participants: [createParticipant({ id: "1", name: "Arsenal" })],
    });

    await user.type(screen.getByPlaceholderText("Team Name"), "arsenal");

    expect(screen.getByText("This team is already added.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
  });

  it("closes the form after submit when action forms are not always visible", async () => {
    const user = userEvent.setup();
    const showForm = vi.fn();

    renderAddTeamForm({
      showActionForms: false,
      showForm,
    });

    await user.type(screen.getByPlaceholderText("Team Name"), "arsenal");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(showForm).toHaveBeenCalledWith(false);
  });
});
