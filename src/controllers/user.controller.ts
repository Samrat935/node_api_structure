/* *
 * Class Name: User Controller
 * Author : Matrix
 * Date: 2025-07-14
 * Version: 1.0.0
 * Description: Handles user-related operations such as fetching,
 * updating, and deleting users.
 * This controller interacts with the user service to perform these operations.
 * It also validates incoming requests using Joi schemas.
 * The controller returns success or error responses based on the operation's outcome.
 */

// Import necessary modules
import e, { Request, Response, NextFunction } from "express";
import userService from "../services/user.service";
import { handleResponse } from "../utils/responseHandler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { error } from "console";
import UserValidation from "../validation/user.validation";
class UserController {
  /**
   * Function Name: getAllUsers
   * Author : Matrix
   * Date: 2025-07-14
   * Version: 1.0.0
   * Description: Fetches all users from the database.
   * It uses the user service to retrieve the users and returns them in the response.
   */
  public async getAllUsers(
    req: Request,
    res: Response,
    next?: NextFunction
  ): Promise<void> {
    try {
      const users = await userService.getAllUsers();

      let msg = "No users found";

      if (Object.keys(users).length != 0) {
        msg = "Users fetched successfully";
      }

      handleResponse(res, 200, msg, users ?? []);
    } catch (error) {
      console.error("UserController Error:", error);
      handleResponse(res, 500, "Failed to fetch users due to a server error", null, error);
    }
  }
  /**
   * Function Name: logOutUser
   * Author
   */
  public async userLogout(req: any, res: Response, next?: NextFunction) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader?.split(" ")[1];

      if (token) {
        let session = await userService.getSession(token);
        if (session) {
          let msg = await userService.delSession(token);
        }
      }

      handleResponse(res, 200, "User has been logged out successfully.");
    } catch (error) {
      console.error("UserController Error:", error);
      handleResponse(
        res,
        500,
        "Failed to logout user due to a server error.",
        null,
        error
      );
    }
  }

  /**
   * Function Name: changePassword
   * Author : Matrix
   * Date: 2025-07-18
   * Version: 1.0.0
   * Description: Changes the user's password using the user service.
   */
  public async changePassword(
    req: any,
    res: Response,
    next?: NextFunction
  ): Promise<void> {

    const userData = req.user_token_decoded_data.user;

    try {

      // Validate password fields
      const { error } = UserValidation.changePasswordSchema().validate(
        req.body
      );

      if (error) {
        return handleResponse(res, 400, error.details[0].message);
      }

      const userId = userData.id;
      const { newPassword, oldPassword } = req.body;

      const result = await userService.changePassword(
        userId,
        oldPassword,
        newPassword
      );

      if (result?.error) {
        return handleResponse(
          res,
          400,
          result.message || "Failed to change password.",
          {
            code: result.code,
            error: result.error,
          }
        );
      }

      handleResponse(res, 200, "Password changed successfully.", result);
    } catch (error) {
      console.error("UserController Error:", error);
      handleResponse(
        res,
        500,
        "Failed to change password due to a server error",
        null,
        error
      );
    }
  }
}

export default new UserController();
