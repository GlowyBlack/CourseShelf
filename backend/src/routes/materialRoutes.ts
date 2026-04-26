import { Router } from "express";
import { createMaterialController } from "../controllers/materialController";

const materialRouter = Router();

materialRouter.post("/", createMaterialController);

export default materialRouter;
