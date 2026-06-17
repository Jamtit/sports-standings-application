import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { initialTournaments } from "../../constants/initialTournaments";
import { renderWithProviders } from "../../../../test/renderWithProviders";
import type {
  Match,
  Participant,
  TournamentTypes,
} from "../../types/tournaments.types";
import AddScoreForm from "./AddScoreForm";

function createParticipant({
  id,
  name,
}: {
  id: string;
  name: string;
}): Participant {
  return {
    id,
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

function renderAddScoreForm({
  matches = [],
  participantLabel = "Team",
  participants = [],
  showActionForms = true,
  showForm = vi.fn(),
  tournamentType = "premier-league",
}: Partial<React.ComponentProps<typeof AddScoreForm>> & {
  matches?: Match[];
  participants?: Participant[];
} = {}) {
  return renderWithProviders(
    <AddScoreForm
      participantLabel={participantLabel}
      showActionForms={showActionForms}
      showForm={showForm}
      tournamentType={tournamentType}
    />,
    {
      preloadedState: createPreloadedState({
        matches,
        participants,
        tournamentType,
      }),
    },
  );
}

describe("AddScoreForm", () => {
  it("keeps submit disabled until participants and valid scores are entered", async () => {
    const user = userEvent.setup();
    const participants = [
      createParticipant({ id: "1", name: "Arsenal" }),
      createParticipant({ id: "2", name: "Chelsea" }),
    ];

    renderAddScoreForm({ participants });

    const [homeParticipantSelect, awayParticipantSelect] =
      screen.getAllByRole("combobox");
    const submitButton = screen.getByRole("button", { name: "Add Score" });

    expect(submitButton).toBeDisabled();

    await user.selectOptions(homeParticipantSelect, "1");
    await user.selectOptions(awayParticipantSelect, "2");
    await user.type(screen.getByPlaceholderText("Home Score"), "2");

    expect(submitButton).toBeDisabled();

    await user.type(screen.getByPlaceholderText("Away Score"), "1");

    expect(submitButton).toBeEnabled();
  });

  it("adds a match and updates participant standings", async () => {
    const user = userEvent.setup();
    const participants = [
      createParticipant({ id: "1", name: "Arsenal" }),
      createParticipant({ id: "2", name: "Chelsea" }),
    ];
    const { store } = renderAddScoreForm({ participants });

    const [homeParticipantSelect, awayParticipantSelect] =
      screen.getAllByRole("combobox");

    await user.selectOptions(homeParticipantSelect, "1");
    await user.selectOptions(awayParticipantSelect, "2");
    await user.type(screen.getByPlaceholderText("Home Score"), "2");
    await user.type(screen.getByPlaceholderText("Away Score"), "1");
    await user.click(screen.getByRole("button", { name: "Add Score" }));

    const tournament =
      store.getState().tournaments.tournaments["premier-league"];

    expect(tournament.matches).toHaveLength(1);
    expect(tournament.matches[0]).toMatchObject({
      participantAId: "1",
      participantBId: "2",
      scoreA: 2,
      scoreB: 1,
    });
    expect(tournament.participants[0].stats).toMatchObject({
      matchesPlayed: 1,
      wins: 1,
      losses: 0,
      draws: 0,
      points: 3,
    });
    expect(tournament.participants[1].stats).toMatchObject({
      matchesPlayed: 1,
      wins: 0,
      losses: 1,
      draws: 0,
      points: 0,
    });
  });

  it("does not offer the selected home participant as an away participant", async () => {
    const user = userEvent.setup();
    const participants = [
      createParticipant({ id: "1", name: "Arsenal" }),
      createParticipant({ id: "2", name: "Chelsea" }),
      createParticipant({ id: "3", name: "Liverpool" }),
    ];

    renderAddScoreForm({ participants });

    const [homeParticipantSelect, awayParticipantSelect] =
      screen.getAllByRole("combobox");

    await user.selectOptions(homeParticipantSelect, "1");

    expect(awayParticipantSelect).not.toHaveTextContent("Arsenal");
    expect(awayParticipantSelect).toHaveTextContent("Chelsea");
    expect(awayParticipantSelect).toHaveTextContent("Liverpool");
  });

  it("does not offer already-played pairings again", async () => {
    const user = userEvent.setup();
    const participants = [
      createParticipant({ id: "1", name: "Arsenal" }),
      createParticipant({ id: "2", name: "Chelsea" }),
      createParticipant({ id: "3", name: "Liverpool" }),
    ];
    const matches = [createMatch("match-1", "1", "2", 2, 1)];

    renderAddScoreForm({ matches, participants });

    const [homeParticipantSelect, awayParticipantSelect] =
      screen.getAllByRole("combobox");

    await user.selectOptions(homeParticipantSelect, "1");

    expect(awayParticipantSelect).not.toHaveTextContent("Chelsea");
    expect(awayParticipantSelect).toHaveTextContent("Liverpool");
  });

  it("shows a message when the selected participant has played every opponent", async () => {
    const user = userEvent.setup();
    const participants = [
      createParticipant({ id: "1", name: "Arsenal" }),
      createParticipant({ id: "2", name: "Chelsea" }),
      createParticipant({ id: "3", name: "Liverpool" }),
    ];
    const matches = [
      createMatch("match-1", "1", "2", 2, 1),
      createMatch("match-2", "3", "1", 0, 0),
    ];

    renderAddScoreForm({ matches, participants });

    await user.selectOptions(screen.getAllByRole("combobox")[0], "1");

    expect(
      screen.getByText(
        "This team has already played every available opponent.",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")[1]).toBeDisabled();
  });

  it("closes the form after submit when action forms are not always visible", async () => {
    const user = userEvent.setup();
    const showForm = vi.fn();
    const participants = [
      createParticipant({ id: "1", name: "Arsenal" }),
      createParticipant({ id: "2", name: "Chelsea" }),
    ];

    renderAddScoreForm({
      participants,
      showActionForms: false,
      showForm,
    });

    const [homeParticipantSelect, awayParticipantSelect] =
      screen.getAllByRole("combobox");

    await user.selectOptions(homeParticipantSelect, "1");
    await user.selectOptions(awayParticipantSelect, "2");
    await user.type(screen.getByPlaceholderText("Home Score"), "1");
    await user.type(screen.getByPlaceholderText("Away Score"), "1");
    await user.click(screen.getByRole("button", { name: "Add Score" }));

    expect(showForm).toHaveBeenCalledWith(false);
  });
});
