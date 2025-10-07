import express, { Express,  Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { setupSwagger } from "./swagger";
import { AccessLogger } from "./utils/accessLogger";
import apiRouter from './routes/index.routes';
import { dbConnectionCreate } from "./middlewares/db_connection_create"

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app: Express = express();

// Enable Cross-Origin Resource Sharing for all routes
app.use(cors());

// HTTP request logging (use 'combined' in production, 'dev' otherwise)
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded data (extended: true allows rich objects/arrays)
app.use(express.urlencoded({ extended: true }));

// Custom access logger middleware (logs to logs/access.log)
const logger = new AccessLogger({ logDirectory: "logs", logFile: "access.log" });
app.use(logger.middleware());
//==
//global.dbName = "imi_db";
app.use(dbConnectionCreate()); // 🌐 Injects db name

// Setup Swagger API documentation
setupSwagger(app);

// Mount API routes at root path
app.use('/', apiRouter);

export default app;
