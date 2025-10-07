import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";

import { handleResponse } from "../utils/responseHandler";

// Load .env once globally
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: path.resolve(__dirname, `../../.env.${env}`) });

// Extend Express Request to include dynamic DB
declare global {
  namespace Express {
    interface Request {
      db?: string;
    }
  }
}

export const dbConnectionCreate = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dbNameHeader = req.headers["x-db-name"];
      const dbName =
        typeof dbNameHeader === "string"
          ? dbNameHeader
          : process.env.AWS_RDS_POSTGRES_DB_NAME;

      if (!dbName) {
        handleResponse(res, 400, "Database name not provided.", null);
        return;
      }
      //console.log(dbName, 'Middleware');
      req.db = dbName;
      global.db = dbName;
      next();
    } catch (err) {
      console.error("DB error:", err);
      handleResponse(
        res,
        500,
        "Failed to resolve database name.",
        null,
        err.message
      );
      return;
    }
  };
};
