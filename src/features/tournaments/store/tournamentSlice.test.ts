import { describe, expect, it } from "vitest";
import tournamentReducer, {
  addMatch,
  addParticipant,
  type TournamentState,
} from "./tournamentSlice";
import { initialTournaments } from "../constants/initialTournaments";
import type { Match, TournamentTypes } from "../types/tournaments.types";

function createInitialState(): TournamentState {
  return structuredClone({ tournaments: initialTournaments });
}

function addTestParticipant(
  state: TournamentState,
  tournamentType: TournamentTypes,
  participantName: string,
) {
  return tournamentReducer(
    state,
    addParticipant({
      tournamentType,
      participantName,
    }),
  );
}

function createMatch(match: Omit<Match, "id">): Match {
  return {
    id: crypto.randomUUID(),
    ...match,
  };
}

describe("tournamentSlice", () => {
  it("adds a participant with zeroed stats", () => {
    const state = tournamentReducer(
      createInitialState(),
      addParticipant({
        tournamentType: "premier-league",
        participantName: "Arsenal",
      }),
    );

    expect(state.tournaments["premier-league"].participants).toEqual([
      {
        id: "00000000-0000-4000-8000-000000000001",
        country: undefined,
        stats: {
          participantId: "00000000-0000-4000-8000-000000000001",
          name: "Arsenal",
          matchesPlayed: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          points: 0,
        },
      },
    ]);
  });

  it("rejects blank participant names", () => {
    const state = tournamentReducer(
      createInitialState(),
      addParticipant({
        tournamentType: "premier-league",
        participantName: "   ",
      }),
    );

    expect(state.tournaments["premier-league"].participants).toHaveLength(0);
  });

  it("rejects duplicate participant names case-insensitively", () => {
    let state = createInitialState();

    state = addTestParticipant(state, "premier-league", "Arsenal");
    state = addTestParticipant(state, "premier-league", "arsenal");

    expect(state.tournaments["premier-league"].participants).toHaveLength(1);
  });

  it("stores a valid participant country", () => {
    const state = tournamentReducer(
      createInitialState(),
      addParticipant({
        tournamentType: "eurobasket",
        participantName: "Lithuania",
        country: "lt",
      }),
    );

    expect(state.tournaments.eurobasket.participants[0].country).toBe("lt");
  });

  it("rejects invalid participant countries", () => {
    const state = tournamentReducer(createInitialState(), {
      type: addParticipant.type,
      payload: {
        tournamentType: "eurobasket",
        participantName: "Atlantis",
        country: "invalid-country",
      },
    });

    expect(state.tournaments.eurobasket.participants).toHaveLength(0);
  });

  it("adds a winning match and updates both participants", () => {
    let state = createInitialState();
    state = addTestParticipant(state, "premier-league", "Arsenal");
    state = addTestParticipant(state, "premier-league", "Chelsea");

    state = tournamentReducer(
      state,
      addMatch({
        tournamentType: "premier-league",
        match: createMatch({
          participantAId: "00000000-0000-4000-8000-000000000001",
          participantBId: "00000000-0000-4000-8000-000000000002",
          scoreA: 2,
          scoreB: 1,
        }),
      }),
    );

    const [arsenal, chelsea] = state.tournaments["premier-league"].participants;

    expect(state.tournaments["premier-league"].matches).toHaveLength(1);
    expect(arsenal.stats).toMatchObject({
      matchesPlayed: 1,
      wins: 1,
      draws: 0,
      losses: 0,
      points: 3,
    });
    expect(chelsea.stats).toMatchObject({
      matchesPlayed: 1,
      wins: 0,
      draws: 0,
      losses: 1,
      points: 0,
    });
  });

  it("adds a draw match and updates both participants", () => {
    let state = createInitialState();
    state = addTestParticipant(state, "premier-league", "Arsenal");
    state = addTestParticipant(state, "premier-league", "Chelsea");

    state = tournamentReducer(
      state,
      addMatch({
        tournamentType: "premier-league",
        match: createMatch({
          participantAId: "00000000-0000-4000-8000-000000000001",
          participantBId: "00000000-0000-4000-8000-000000000002",
          scoreA: 1,
          scoreB: 1,
        }),
      }),
    );

    const [arsenal, chelsea] = state.tournaments["premier-league"].participants;

    expect(arsenal.stats).toMatchObject({
      matchesPlayed: 1,
      wins: 0,
      draws: 1,
      losses: 0,
      points: 1,
    });
    expect(chelsea.stats).toMatchObject({
      matchesPlayed: 1,
      wins: 0,
      draws: 1,
      losses: 0,
      points: 1,
    });
  });

  it("rejects duplicate matches between the same pair", () => {
    let state = createInitialState();
    state = addTestParticipant(state, "premier-league", "Arsenal");
    state = addTestParticipant(state, "premier-league", "Chelsea");

    const firstMatch = createMatch({
      participantAId: "00000000-0000-4000-8000-000000000001",
      participantBId: "00000000-0000-4000-8000-000000000002",
      scoreA: 2,
      scoreB: 1,
    });
    const reverseDuplicateMatch = createMatch({
      participantAId: "00000000-0000-4000-8000-000000000002",
      participantBId: "00000000-0000-4000-8000-000000000001",
      scoreA: 4,
      scoreB: 0,
    });

    state = tournamentReducer(
      state,
      addMatch({ tournamentType: "premier-league", match: firstMatch }),
    );
    state = tournamentReducer(
      state,
      addMatch({
        tournamentType: "premier-league",
        match: reverseDuplicateMatch,
      }),
    );

    expect(state.tournaments["premier-league"].matches).toHaveLength(1);
    expect(
      state.tournaments["premier-league"].participants.map(
        (participant) => participant.stats.matchesPlayed,
      ),
    ).toEqual([1, 1]);
  });

  it("rejects matches where a participant plays themselves", () => {
    let state = createInitialState();
    state = addTestParticipant(state, "premier-league", "Arsenal");

    state = tournamentReducer(
      state,
      addMatch({
        tournamentType: "premier-league",
        match: createMatch({
          participantAId: "00000000-0000-4000-8000-000000000001",
          participantBId: "00000000-0000-4000-8000-000000000001",
          scoreA: 1,
          scoreB: 0,
        }),
      }),
    );

    expect(state.tournaments["premier-league"].matches).toHaveLength(0);
    expect(
      state.tournaments["premier-league"].participants[0].stats.matchesPlayed,
    ).toBe(0);
  });

  it("rejects matches with missing participant IDs", () => {
    let state = createInitialState();
    state = addTestParticipant(state, "premier-league", "Arsenal");

    state = tournamentReducer(
      state,
      addMatch({
        tournamentType: "premier-league",
        match: createMatch({
          participantAId: "00000000-0000-4000-8000-000000000001",
          participantBId: "missing-participant",
          scoreA: 1,
          scoreB: 0,
        }),
      }),
    );

    expect(state.tournaments["premier-league"].matches).toHaveLength(0);
    expect(
      state.tournaments["premier-league"].participants[0].stats.matchesPlayed,
    ).toBe(0);
  });
});
