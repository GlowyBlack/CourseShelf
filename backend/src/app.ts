import cors from "cors";
import express from "express";
import courseRouter from "./routes/courseRoutes";
import materialRouter from "./routes/materialRoutes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/courses", courseRouter);
  app.use("/courses/:courseId/materials", materialRouter);

  return app;
}
