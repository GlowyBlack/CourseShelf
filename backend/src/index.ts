import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { getDb } from "./db";
import courseRouter from "./routes/courseRoutes";
import materialRouter from "./routes/materialRoutes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use("/courses", courseRouter);
app.use("/materials", materialRouter);

async function startServer() {
  const db = getDb();
  await db.$connect();

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

void startServer();
