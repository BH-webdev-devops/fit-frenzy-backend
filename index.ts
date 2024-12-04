import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { pool } from "./db/db";
import authRouter from "./routers/authRouter";
import profileRouter from "./routers/profileRouter";
import workRouter from "./routers/workoutRouter";
import quoteRouter from "./routers/quoteRouter";

const port = process.env.PORT || 3009;

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response): any => {
  return res.send(`Welcome to our node and postgres API server`);
});

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", workRouter);
app.use("/api", quoteRouter);

const startServer = async () => {
  try {
    const client = await pool.connect();
    console.log("Database connected");
    client.release();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};
startServer();
