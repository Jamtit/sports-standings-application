import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TournamentCardHeader from "./TournamentCardHeader";

describe("TournamentCardHeader", () => {
  it("renders the tournament title", () => {
    render(
      <TournamentCardHeader
        title="EuroBasket"
        tournamentType="eurobasket"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "EuroBasket" }),
    ).toBeInTheDocument();
  });

  it("renders an icon when one is provided", () => {
    const { container } = render(
      <TournamentCardHeader
        icon="basketball"
        title="EuroBasket"
        tournamentType="eurobasket"
      />,
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("omits the icon when none is provided", () => {
    const { container } = render(
      <TournamentCardHeader
        icon=""
        title="Premier League"
        tournamentType="premier-league"
      />,
    );

    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});
