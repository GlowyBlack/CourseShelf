import { Router } from "express";
import {
  createMaterialController,
  deleteMaterialController,
  editMaterialController,
  getMaterialsByCourseController,
} from "../controllers/materialController";

const materialRouter = Router({ mergeParams: true });

materialRouter.get("/", getMaterialsByCourseController);
materialRouter.post("/", createMaterialController);
materialRouter.patch("/", editMaterialController);
materialRouter.delete("/", deleteMaterialController);

export default materialRouter;
