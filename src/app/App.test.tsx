import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test/renderWithProviders";
import App from "./App";

describe("App", () => {
  it("renders the tournaments experience", () => {
    renderWithProviders(<App />);

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
});
