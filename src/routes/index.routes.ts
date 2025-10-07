import { Router, Request, Response, NextFunction } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import menuRoutes from "./menu.routes";
import verifyToken from "../middlewares/verifyTokenMiddleware";
import { handleResponse } from "../utils/responseHandler";

const apiRouter = Router();

/**
 * @route   GET /
 * @desc    Health check endpoint
 * @access  Public
 */
apiRouter.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ status: "UP" });
});

/**
 * @route   /user
 * @desc    user related routes
 */
apiRouter.use("/users", verifyToken, userRoutes);
/**
 * @route   /menu
 * @desc    menu related routes
 */
apiRouter.use("/menu", verifyToken, menuRoutes);
/**
 * @route   /auth
 * @desc    auth related routes
 */
apiRouter.use("/auth", authRoutes);

/**
 * @desc    404 handler for unmatched routes
 */
apiRouter.use((_req: Request, res: Response) => {
  return handleResponse(res, 404, "Not Found - Resource Missing");
});

/**
 * @desc    500 Global error handler
 */
apiRouter.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    return handleResponse(res, 500, "Internal Server Error", {
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

/**
 * @desc    502 Invalid response from upstream
 */
apiRouter.use((_req: Request, res: Response) => {
  return handleResponse(res, 502, "Invalid response from upstream");
});

/**
 * @desc    503 Service overloaded or down
 */
apiRouter.use((_req: Request, res: Response) => {
  return handleResponse(res, 503, "Service overloaded or down");
});

/**
 * @desc    504 Gateway Timeout
 */
apiRouter.use((_req: Request, res: Response) => {
  return handleResponse(res, 504, "Gateway Timeout");
});

export default apiRouter;
