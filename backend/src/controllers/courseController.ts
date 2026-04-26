import type { Request, Response } from "express";
import { createCourse } from "../repositories/courseRepository";

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

  if (!Number.isInteger(year)) {
    return res.status(400).json({ error: "Year must be a whole number (e.g., 2026)" });
  }

  if(year<1900) {
    return res.status(400).json({ error: "Year must be greater than or equal to 1900" });
  }

  if(termSeason != 'S' && termSeason != 'W'){
    return res.status(400).json({ error: "Term must be Summer or Winter" });
  }

  if (!Number.isInteger(semester)) {
    return res.status(400).json({ error: "Semester must be a whole number (1 or 2)" });
  }
  
  if(semester<1 || semester>2) {
    return res.status(400).json({ error: "Semester must be a whole number (1 or 2)" });
  }

  const term = year.toString() + termSeason + semester;
  try {
    const course = await createCourse({
      name,
      department,
      term,
    });

    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
