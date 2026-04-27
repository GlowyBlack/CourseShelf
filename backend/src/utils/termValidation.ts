export type TermValidationInput = {
  year: number;
  termSeason: string;
  semester: number;
};

export type TermValidationResult =
  | { valid: true; term: string }
  | { valid: false; error: string };

export function validateAndBuildTerm(input: TermValidationInput): TermValidationResult {
  const { year, termSeason, semester } = input;

  if (!Number.isInteger(year)) {
    return { valid: false, error: "Year must be a whole number (e.g., 2026)" };
  }

  if (year < 1900) {
    return { valid: false, error: "Year must be greater than or equal to 1900" };
  }

  if (termSeason !== "S" && termSeason !== "W") {
    return { valid: false, error: "Term must be Summer or Winter" };
  }

  if (!Number.isInteger(semester) || semester < 1 || semester > 2) {
    return { valid: false, error: "Semester must be a whole number (1 or 2)" };
  }

  return { valid: true, term: `${year}${termSeason}${semester}` };
}
