import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { handleResponse } from "../utils/responseHandler";
import UserService from "../services/user.service";

// Extend the Request interface to allow a 'user' property
interface CustomRequest extends Request {
  user_token_data?: string | JwtPayload;
   user_token_decoded_data?: string | JwtPayload;
}

/**
 * Middleware to verify JWT token from the Authorization header.
 * If valid, attaches the decoded user info to req.user and calls next().
 * If invalid or missing, responds with appropriate error message.
 */
async function verifyToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  // Get the Authorization header (format: "Bearer <token>")
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  // If no token is provided, return 401 Forbidden
  if (!token) {
    return handleResponse(
      res,
      401,
      "Access denied. Token is required for authentication."
    );
  }

  const loginSession: any = await UserService.getSession(token);

  if (!loginSession) {
    return handleResponse(res, 401, "Access denied. Invalid or expired token.");
  }

  // Verify the token using the JWT_SECRET
  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      // If verification fails, return 401 Forbidden with error details
      return handleResponse(
        res,
        401,
        "Access denied. Invalid or expired token.",
        { error: err.message || err }
      );
    }
    // Attach decoded user info to the request object
    req.user_token_data = token;
    req.user_token_decoded_data = decoded;
    next();
  });
}

export default verifyToken;
