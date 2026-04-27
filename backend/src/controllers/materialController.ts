import type { Request, Response } from "express";
import { courseExistsById } from "../repositories/courseRepository";
import {
  createMaterial,
  deleteMaterialById,
  getMaterialByIdAndCourseId,
  getMaterialsByCourseId,
  updateMaterialById,
} from "../repositories/materialRepository";

type CreateMaterialRequestBody = {
  title: string;
  type: string;
  description: string;
  link: string;
};

type EditMaterialRequestBody = {
  materialId: number;
  title?: string;
  type?: string;
  description?: string;
  link?: string;
};

type DeleteMaterialRequestBody = {
  materialId: number;
};

const allowedTypes = new Set(["Lecture Notes", "Assignment", "Syllabus", "Other"]);

export async function createMaterialController(
  req: Request<{ courseId: string }, unknown, CreateMaterialRequestBody>,
  res: Response
) {
  const title = req.body.title?.trim();
  const type = req.body.type;
  const description = req.body.description?.trim();
  const rawLink = req.body.link?.trim();
  const courseId = Number(req.params.courseId);

  if (!title) return res.status(400).json({ error: "Title is required" });

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

  if (!description) return res.status(400).json({ error: "Description is required" });

  const link = rawLink && rawLink.length > 0 ? rawLink : undefined;

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
      link,
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

export async function getMaterialsByCourseController(
  req: Request<{ courseId: string }>,
  res: Response
) {
  const courseId = Number(req.params.courseId);

  if (!Number.isInteger(courseId) || courseId <= 0) {
    return res.status(400).json({ error: "courseId must be a positive integer" });
  }

  try {
    const courseExists = await courseExistsById(courseId);
    if (!courseExists) {
      return res.status(404).json({ error: "courseId does not reference an existing course" });
    }

    const materials = await getMaterialsByCourseId(courseId);
    return res.status(200).json(materials);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch materials",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function editMaterialController( 
  req: Request<{ courseId: string }, unknown, EditMaterialRequestBody>,
  res: Response
) {
  const courseId = Number(req.params.courseId);
  const materialId = req.body.materialId;

  if (!Number.isInteger(courseId) || courseId <= 0) {
    return res.status(400).json({ error: "courseId must be a positive integer" });
  }

  if (typeof materialId !== "number" || !Number.isInteger(materialId) || materialId <= 0) {
    return res.status(400).json({ error: "materialId must be a positive integer" });
  }

  const title = req.body.title?.trim();
  const type = req.body.type?.trim();
  const description = req.body.description?.trim();
  const rawLink = req.body.link?.trim();

  const hasAnyField =
    req.body.title !== undefined ||
    req.body.type !== undefined ||
    req.body.description !== undefined ||
    req.body.link !== undefined;

  if (!hasAnyField) {
    return res.status(400).json({ error: "At least one field is required to update material" });
  }

  if (req.body.title !== undefined && !title) {
    return res.status(400).json({ error: "Title cannot be empty" });
  }

  if (req.body.type !== undefined) {
    if (!type || !allowedTypes.has(type)) {
      return res.status(400).json({
        error: "Type must be one of: Lecture Notes, Assignment, Syllabus, Other",
      });
    }
  }

  if (req.body.description !== undefined && !description) {
    return res.status(400).json({ error: "Description cannot be empty" });
  }

  try {
    const courseExists = await courseExistsById(courseId);
    if (!courseExists) {
      return res.status(404).json({ error: "courseId does not reference an existing course" });
    }

    const material = await getMaterialByIdAndCourseId(materialId, courseId);
    if (!material) {
      return res
        .status(404)
        .json({ error: "Material not found for this course" });
    }

    const updatedMaterial = await updateMaterialById(materialId, {
      ...(title !== undefined ? { title } : {}),
      ...(type !== undefined ? { type } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(req.body.link !== undefined ? { link: rawLink || null } : {}),
    });

    return res.status(200).json(updatedMaterial);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update material",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteMaterialController(
  req: Request<{ courseId: string }, unknown, DeleteMaterialRequestBody>,
  res: Response
) {
  const courseId = Number(req.params.courseId);
  const materialId = req.body.materialId;

  if (!Number.isInteger(courseId) || courseId <= 0) {
    return res.status(400).json({ error: "courseId must be a positive integer" });
  }

  if (typeof materialId !== "number" || !Number.isInteger(materialId) || materialId <= 0) {
    return res.status(400).json({ error: "materialId must be a positive integer" });
  }

  try {
    const courseExists = await courseExistsById(courseId);
    if (!courseExists) {
      return res.status(404).json({ error: "courseId does not reference an existing course" });
    }

    const material = await getMaterialByIdAndCourseId(materialId, courseId);
    if (!material) {
      return res
        .status(404)
        .json({ error: "Material not found for this course" });
    }

    await deleteMaterialById(materialId);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete material",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
