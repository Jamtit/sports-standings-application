import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Icon from "./Icon";

describe("Icon", () => {
  it("renders the requested tournament icon", () => {
    const { container } = render(
      <Icon className="tournament-icon" name="basketball" size={30} />,
    );

    const icon = container.querySelector("svg");

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("tournament-icon");
    expect(icon).toHaveAttribute("width", "30");
    expect(icon).toHaveAttribute("height", "30");
  });

  it("uses the default icon size", () => {
    const { container } = render(
      <Icon className="tournament-icon" name="tennis" />,
    );

    expect(container.querySelector("svg")).toHaveAttribute("width", "16");
    expect(container.querySelector("svg")).toHaveAttribute("height", "16");
  });
});
