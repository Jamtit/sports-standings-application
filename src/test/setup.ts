import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";

let uuidIndex = 0;

beforeEach(() => {
  uuidIndex = 0;

  vi.spyOn(crypto, "randomUUID").mockImplementation(() => {
    uuidIndex += 1;

    return `00000000-0000-4000-8000-${uuidIndex
      .toString()
      .padStart(12, "0")}`;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
