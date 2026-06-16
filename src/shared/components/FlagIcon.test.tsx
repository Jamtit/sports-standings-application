import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FlagIcon from "./FlagIcon";

describe("FlagIcon", () => {
  it("renders an accessible flag image", () => {
    render(<FlagIcon code="lt" label="Lithuania" />);

    expect(
      screen.getByRole("img", { name: "Lithuania flag" }),
    ).toBeInTheDocument();
  });

  it("normalizes country code classes to lowercase", () => {
    render(<FlagIcon code="LT" label="Lithuania" className="custom-flag" />);

    expect(screen.getByRole("img", { name: "Lithuania flag" })).toHaveClass(
      "fi",
      "fi-lt",
      "custom-flag",
    );
  });
});
