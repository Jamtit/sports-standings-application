import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Button from "./Button";

describe("Button", () => {
  it("renders a button with an accessible name", () => {
    render(<Button>Add Score</Button>);

    expect(
      screen.getByRole("button", { name: "Add Score" }),
    ).toBeInTheDocument();
  });

  it("uses button type by default", () => {
    render(<Button>Add</Button>);

    expect(screen.getByRole("button", { name: "Add" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("supports submit type", () => {
    render(<Button type="submit">Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("supports disabled state", () => {
    render(<Button disabled>Submit</Button>);

    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });
});
