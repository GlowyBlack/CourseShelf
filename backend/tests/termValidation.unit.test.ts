import { describe, expect, it } from "vitest";
import { validateAndBuildTerm } from "../src/utils/termValidation";

describe("validateAndBuildTerm", () => {
  it("builds term for valid input", () => {
    const result = validateAndBuildTerm({
      year: 2026,
      termSeason: "W",
      semester: 1,
    });

    expect(result).toEqual({
      valid: true,
      term: "2026W1",
    });
  });

  it("returns validation error for invalid semester", () => {
    const result = validateAndBuildTerm({
      year: 2026,
      termSeason: "S",
      semester: 3,
    });

    expect(result).toEqual({
      valid: false,
      error: "Semester must be a whole number (1 or 2)",
    });
  });
});
