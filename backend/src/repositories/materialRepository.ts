import { getDb } from "../db";

export type CreateMaterialInput = {
  title: string;
  type: string;
  description: string;
  link: string;
  courseId: number;
};

export type UpdateMaterialInput = {
  title?: string;
  type?: string;
  description?: string;
  link?: string | null;
};

export async function createMaterial(data: CreateMaterialInput) {
  const db = getDb();

  return db.material.create({
    data: {
      title: data.title,
      type: data.type,
      description: data.description,
      ...(data.link ? { link: data.link } : {}),
      courseId: data.courseId,
    },
  });
}

export async function getMaterialsByCourseId(courseId: number) {
  const db = getDb();

  return db.material.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMaterialByIdAndCourseId(materialId: number, courseId: number) {
  const db = getDb();

  return db.material.findFirst({
    where: {
      id: materialId,
      courseId,
    },
  });
}

export async function updateMaterialById(materialId: number, data: UpdateMaterialInput) {
  const db = getDb();
  return db.material.update({
    where: { id: materialId },
    data,
  });
}

export async function deleteMaterialById(materialId: number) {
  const db = getDb();
  return db.material.delete({
    where: { id: materialId },
  });
}
