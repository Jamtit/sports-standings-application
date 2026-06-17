import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { initialTournaments } from "../../constants/initialTournaments";
import { renderWithProviders } from "../../../../test/renderWithProviders";
import TournamentsContainer from "./TournamentsContainer";

function createPreloadedState({
  tournamentTypes,
}: {
  tournamentTypes?: Array<keyof typeof initialTournaments>;
} = {}) {
  const tournaments = structuredClone(initialTournaments);

  if (tournamentTypes) {
    Object.keys(tournaments).forEach((tournamentType) => {
      if (
        !tournamentTypes.includes(
          tournamentType as keyof typeof initialTournaments,
        )
      ) {
        delete tournaments[tournamentType as keyof typeof initialTournaments];
      }
    });
  }

  return {
    tournaments: {
      tournaments,
    },
  };
}

describe("TournamentsContainer", () => {
  it("renders all tournament cards from redux state", () => {
    renderWithProviders(<TournamentsContainer />);

    expect(
      screen.getByRole("heading", { name: "Premier League" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "EuroBasket" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Wimbledon" }),
    ).toBeInTheDocument();
  });

  it("renders cards from the tournament type selector instead of hardcoded markup", () => {
    renderWithProviders(<TournamentsContainer />, {
      preloadedState: createPreloadedState({
        tournamentTypes: ["eurobasket"],
      }),
    });

    expect(
      screen.queryByRole("heading", { name: "Premier League" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "EuroBasket" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Wimbledon" }),
    ).not.toBeInTheDocument();
  });
});
