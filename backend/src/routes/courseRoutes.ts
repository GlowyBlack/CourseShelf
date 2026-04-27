import { Router } from "express";
import {
  createCourseController,
  getCourseByIdController,
  getCoursesController,
} from "../controllers/courseController";

const courseRouter = Router();

courseRouter.get("/", getCoursesController);
courseRouter.post("/", createCourseController);
courseRouter.get("/:courseId", getCourseByIdController);

export default courseRouter;
