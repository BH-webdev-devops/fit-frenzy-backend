import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { pool } from "./db/db";
import authRouter from "./routers/authRouter";
import profileRouter from "./routers/profileRouter";
import workRouter from "./routers/workoutRouter";
import quoteRouter from "./routers/quoteRouter";
import adminRouter from "./routers/adminRouter";
import postRouter from "./routers/postRouter";
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const port = process.env.PORT || 3009;

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'API for managing users',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['docs/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req: Request, res: Response): any => {
  return res.send(`Welcome to FitFrenzy Website`);
});

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", workRouter);
app.use("/api", quoteRouter);
app.use("/api", adminRouter);
app.use("/api", postRouter);

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
