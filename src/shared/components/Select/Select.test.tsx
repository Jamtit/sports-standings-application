import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Select from "./Select";

const options = [
  { label: "Lithuania", value: "lt" },
  { label: "Spain", value: "es" },
];

describe("Select", () => {
  it("renders a labelled combobox", () => {
    render(
      <Select
        id="country"
        label="Country"
        options={options}
        selectSize="medium"
      />,
    );

    expect(screen.getByRole("combobox", { name: "Country" })).toBeInTheDocument();
  });

  it("renders the default placeholder option", () => {
    render(<Select options={options} selectSize="medium" />);

    expect(screen.getByRole("option", { name: "Select Option" })).toHaveValue("");
  });

  it("renders provided options", () => {
    render(<Select options={options} selectSize="medium" />);

    expect(screen.getByRole("option", { name: "Lithuania" })).toHaveValue("lt");
    expect(screen.getByRole("option", { name: "Spain" })).toHaveValue("es");
  });

  it("calls onChange when an option is selected", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Select
        id="country"
        label="Country"
        options={options}
        selectSize="medium"
        onChange={handleChange}
      />,
    );

    await user.selectOptions(screen.getByRole("combobox", { name: "Country" }), "lt");

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("combobox", { name: "Country" })).toHaveValue("lt");
  });
});
