import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  BasketballIcon,
  PlusIcon,
  TennisBallIcon,
  TickIcon,
  XIcon,
} from ".";

const ICONS = [
  BasketballIcon,
  PlusIcon,
  TennisBallIcon,
  TickIcon,
  XIcon,
] as const;

describe("icons", () => {
  it.each(ICONS)("renders an aria-hidden svg", (Icon) => {
    const { container } = render(<Icon className="test-icon" size={24} />);
    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it.each(ICONS)("applies the provided className", (Icon) => {
    const { container } = render(<Icon className="test-icon" size={24} />);

    expect(container.querySelector("svg")).toHaveClass("test-icon");
  });

  it.each(ICONS)("applies the provided size", (Icon) => {
    const { container } = render(<Icon className="test-icon" size={24} />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
  });
});
