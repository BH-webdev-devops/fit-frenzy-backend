import { Request, Response } from "express";
import { query } from "../db/db";

export const getQuotes = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  try {
    const quotes = await query(`SELECT * FROM quotes`);
    console.log("Profile fetched successfully");
    if (quotes.rowCount === 0) {
      return res.status(404).json({ message: "Quotes not found" });
    }
    return res.status(200).json({
      message: "Quotes",
      result: quotes.rows,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: `Internal server error`, details: err });
  }
};
