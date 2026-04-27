import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app";
import * as courseRepository from "../src/repositories/courseRepository";

vi.mock("../src/repositories/courseRepository", async () => {
  const actual = await vi.importActual<typeof import("../src/repositories/courseRepository")>(
    "../src/repositories/courseRepository"
  );
  return {
    ...actual,
    createCourse: vi.fn(),
    getCourses: vi.fn(),
    getCourseById: vi.fn(),
    courseExistsById: vi.fn(),
  };
});

describe("courses endpoints", () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST /courses returns 400 for missing name", async () => {
    const response = await request(app).post("/courses").send({
      department: "CS",
      termSeason: "W",
      semester: 1,
      year: 2026,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Course name is required" });
  });

  it("GET /courses/:id returns course with materials", async () => {
    const mockedCourse = {
      id: 1,
      name: "Data Structures",
      department: "CS",
      term: "2026W1",
      materials: [
        {
          id: 10,
          title: "Practice Final",
          type: "Other",
          description: "Final exam review questions",
          link: "https://example.com/final",
          courseId: 1,
        },
      ],
    };
    vi.mocked(courseRepository.getCourseById).mockResolvedValue(mockedCourse as never);

    const response = await request(app).get("/courses/1");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 1,
      name: "Data Structures",
      department: "CS",
      term: "2026W1",
      materials: [
        {
          id: 10,
          title: "Practice Final",
          courseId: 1,
        },
      ],
    });
  });
});
