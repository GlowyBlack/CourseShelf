import type { Request, Response } from "express";
import { courseExistsById } from "../repositories/courseRepository";
import { createMaterial } from "../repositories/materialRepository";

type CreateMaterialRequestBody = {
  title: string;
  type: string;
  description: string;
  link?: unknown;
  courseId: number;
};

const allowedTypes = new Set(["Lecture Notes", "Assignment", "Syllabus", "Other"]);

export async function createMaterialController(
  req: Request<unknown, unknown, CreateMaterialRequestBody>,
  res: Response
) {
  const title = req.body.title?.trim();
  const type = req.body.type;
  const description = req.body.description?.trim();
  const rawLink = req.body.link;
  const courseId = req.body.courseId;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  if (typeof type !== "string") {
    return res.status(400).json({
      error: "Type must be one of: Lecture Notes, Assignment, Syllabus, Other",
    });
  }

  const normalizedType = type.trim();
  if (!allowedTypes.has(normalizedType)) {
    return res.status(400).json({
      error: "Type must be one of: Lecture Notes, Assignment, Syllabus, Other",
    });
  }

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  let link: string | undefined;
  if (rawLink !== undefined) {
    if (typeof rawLink !== "string") {
      return res.status(400).json({ error: "Only one link string is allowed" });
    }

    const normalizedLink = rawLink.trim();
    link = normalizedLink.length > 0 ? normalizedLink : undefined;
  }

  if (typeof courseId !== "number" || !Number.isInteger(courseId) || courseId <= 0) {
    return res.status(400).json({ error: "courseId must be a positive integer" });
  }

  try {
    const courseExists = await courseExistsById(courseId);
    if (!courseExists) {
      return res.status(404).json({ error: "courseId does not reference an existing course" });
    }

    const material = await createMaterial({
      title,
      type: normalizedType,
      description,
      ...(link ? { link } : {}),
      courseId,
    });

    return res.status(201).json(material);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create material",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
