import { getDb } from "../db";

export type CreateCourseInput = {
  name: string;
  department: string;
  term: string;
};

export async function createCourse(data: CreateCourseInput) {
  const db = getDb();

  return db.course.create({
    data,
  });
}

export async function courseExistsById(courseId: number): Promise<boolean> {
  const db = getDb();
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  });

  return course !== null;
}

export async function getCourses() {
  const db = getDb();

  return db.course.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourseById(courseId: number) {
  const db = getDb();

  return db.course.findUnique({
    where: { id: courseId },
    include: {
      materials: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
