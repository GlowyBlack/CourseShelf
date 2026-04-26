import { getDb } from "../db";

export type CreateMaterialInput = {
  title: string;
  type: string;
  description: string;
  link?: string;
  courseId: number;
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
