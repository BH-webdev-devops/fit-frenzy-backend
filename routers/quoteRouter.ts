import { Router } from "express";
import { getQuotes } from "../controllers/quoteController";

const quoteRouter = Router();
quoteRouter.get("/quotes", getQuotes);

export default quoteRouter;
