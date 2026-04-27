import dotenv from "dotenv";
import { getDb } from "./db";
import { createApp } from "./app";

dotenv.config();

const app = createApp();
const port = Number(process.env.PORT ?? 3000);

async function startServer() {
  const db = getDb();
  await db.$connect();

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

void startServer();
