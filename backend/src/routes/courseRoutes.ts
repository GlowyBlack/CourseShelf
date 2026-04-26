import { Router } from "express";
import { createCourseController } from "../controllers/courseController";

const courseRouter = Router();

courseRouter.post("/", createCourseController);

export default courseRouter;
