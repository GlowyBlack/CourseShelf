import type { Request, Response } from "express";
import {
  createCourse,
  getCourseById,
  getCourses,
} from "../repositories/courseRepository";
import { validateAndBuildTerm } from "../utils/termValidation";

type CreateCourseRequestBody = {
  name: string;
  department: string;
  termSeason: 'S' | 'W';
  semester: number;
  year: number;
};

export async function createCourseController(
  req: Request<unknown, unknown, CreateCourseRequestBody>,
  res: Response
) {
  const name = req.body.name?.trim();
  const department = req.body.department?.trim();
  const termSeason = req.body.termSeason?.trim();
  const semester = req.body.semester??0;
  const year = req.body.year??0;

  if(!name){
    return res.status(400).json({ error: "Course name is required" });
  }

  if(!department){
    return res.status(400).json({ error: "Department is required" });
  }

  const termValidation = validateAndBuildTerm({
    year,
    termSeason: termSeason ?? "",
    semester,
  });
  if (!termValidation.valid) {
    return res.status(400).json({ error: termValidation.error });
  }

  try {
    const course = await createCourse({
      name,
      department,
      term: termValidation.term,
    });

    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getCoursesController(_req: Request, res: Response) {
  try {
    const courses = await getCourses();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch courses",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getCourseByIdController(
  req: Request<{ courseId: string }>,
  res: Response
) {
  const courseId = Number(req.params.courseId);

  if (!Number.isInteger(courseId) || courseId <= 0) {
    return res.status(400).json({ error: "courseId must be a positive integer" });
  }

  try {
    const course = await getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
