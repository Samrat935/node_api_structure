/**
 * Controller name: Auth Controller
 * Author: Matrix
 * Date: 2025-07-14
 * Version: 1.0.0
 * Description: Handles authentication-related operations.
 * This controller interacts with the user service to perform authentication operations.
 */
import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
import { handleResponse } from "../utils/responseHandler";
import UserValidation from "../validation/user.validation";
import jwt from "jsonwebtoken";
import { error } from "console";
import { EmailOptions, sendAllMail } from "../helper/email_send";
import path from "path";
class AuthController {
  /**
   * Handles user registration.
   * - Validates input
   * - Creates user record
   * - Sends welcome email
   * - Returns success response
   */
  async userRegistration(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { error } = UserValidation.createUserSchema().validate(req.body);
      if (error) {
        handleResponse(res, 400, "Validation error", null, error.details);
      }

      const newUser = await UserService.createUser(req.body);
      if (newUser.error) {
        handleResponse(res, 400, newUser.message, {
          code: newUser.code,
          error: newUser.error,
        });
      }

      //=================================================
      if (newUser) {
        // Resolve absolute path for the main email template (header/footer/layout)
        const absoluteTemplatePath = path.resolve(
          __dirname,
          "../views/templates/email_template_1.html"
        );

        // Resolve absolute path for the email content template (signup-specific content)
        const absoluteMailContent = path.resolve(
          __dirname,
          "../views/templates/signup.html"
        );
        let login_url = process.env.FRONT_END_URL + "login";

        // Prepare email data with recipient, subject, templates, and dynamic variables
        const emailData: EmailOptions = {
          to: newUser.email, // Recipient's email address
          subject:
            "Welcome to IMI Platform — Your Account Has Been Successfully Created!", // Email subject line
          templatePath: absoluteTemplatePath, // Base layout template path
          mail_content_path: absoluteMailContent, // Content-specific template path
          variables: {
            name: `${newUser.first_name} ${newUser.last_name}`, // User's full name for personalization
            login_url: login_url, // Login URL to be injected in the template
          },
        };

        // Send the welcome email using the prepared data
        await sendAllMail(emailData);
      }
      //================================================
      handleResponse(res, 201, "User registered successfully", newUser);
    } catch (err) {
      console.error("AuthController Error:", err);
      handleResponse(
        res,
        500,
        "Failed to create user due to a server error.",
        null,
        error
      );
    }
  }

  /**
   * Handles user login.
   * - Validates credentials
   * - Generates JWT token
   * - Creates login session
   * - Returns token and user data
   */
  async userLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const ipAddress =
        req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
        req.socket.remoteAddress;
      if (!email || !password) {
        handleResponse(res, 400, "Email and password are required for login");
      }
      const userData = await UserService.loginUser(email, password, ipAddress);
      if (userData.error) {
        handleResponse(res, 400, userData.message, {
          code: userData.code,
          error: userData.error,
        });
      }
      // console.log(userData.user.id);
      const token = jwt.sign(
        { user: userData.user },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        }
      );
      await UserService.loginSessionCreate({
        user_id: userData.user.id,
        token: token,
      });
      handleResponse(res, 200, userData.message, { token, userData });
    } catch (err) {
      console.error("AuthController Error:", err);
      handleResponse(
        res,
        500,
        "Failed to login user due to a server error.",
        null,
        error
      );
    }
  }

  /**
   * Function Name: forgetPassword
   * Author : Matrix
   * Date: 2025-07-17
   * Version: 1.0.0
   * Description: Fetche user account by user service and sending mail with reset password link.
   */
  async forgetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //==================================================
      if (!req.body.email && req.body.email == undefined) {
        handleResponse(res, 400, "Please enter your email address.", {
          code: "VALIDATION_ERROR",
          error: true,
        });
      }
      //==================================================
      const user = await UserService.forgetPassword(req.body);
      if (user.error) {
        handleResponse(res, 400, user.message, {
          code: user.code,
          error: user.error,
        });
      }
      //=================================================
      if (user) {
        // Resolve absolute path for the main email template (header/footer/layout)
        const absoluteTemplatePath = path.resolve(
          __dirname,
          "../views/templates/email_template_1.html"
        );

        // Resolve absolute path for the email content template (forgetpass-specific content)
        const absoluteMailContent = path.resolve(
          __dirname,
          "../views/templates/forgetpass.html"
        );

        // password reset URL create
        let reset_url =
          process.env.FRONT_END_URL +
          "user/password-reset?token=" +
          user.data.token;

        // Prepare email data with recipient, subject, templates, and dynamic variables
        const emailData: EmailOptions = {
          to: user.data.userData.email, // Recipient's email address
          subject: "IMI Account – Password Reset Instructions", // Email subject line
          templatePath: absoluteTemplatePath, // Base layout template path
          mail_content_path: absoluteMailContent, // Content-specific template path
          variables: {
            name: `${user.data.userData.first_name} ${user.data.userData.last_name}`, // User's full name for personalization
            reset_url: reset_url, // password reset URL to be injected in the template
          },
        };
        // Send the welcome email using the prepared data
        await sendAllMail(emailData);
      }
      //================================================
      handleResponse(
        res,
        200,
        "Password reset instructions have been sent to your email.",
        user
      );
    } catch (err) {
      console.error("AuthController Error:", err);
      handleResponse(
        res,
        500,
        "Failed to send email due to a server error.",
        null,
        error
      );
    }
  }

  /**
   * Function Name: verifyResetToken
   * Author : Matrix
   * Date: 2025-07-17
   * Version: 1.0.0
   * Description: This function will verify password reset token.
   */
  public async verifyResetToken(req, res): Promise<any> {
    try {
      const { token } = req.body;

      if (!token) {
        handleResponse(res, 400, "Please enter provide a valid token.", {
          code: "VALIDATION_ERROR",
          error: true,
        });
      }

      const result = await UserService.verifyResetToken(token);

      if (result.error) {
        handleResponse(res, 400, result.message, {
          code: result.code,
          error: result.error,
        });
      }

      handleResponse(
        res,
        200,
        "Valid token. You may proceed to reset your password.",
        result
      );
    } catch (err) {
      console.error("AuthController Error:", err);
      handleResponse(
        res,
        500,
        "Failed to verify token due to a server error",
        null,
        error
      );
    }
  }

  //

  /**
   * Function Name: resetPassword
   * Author : Matrix
   * Date: 2025-07-17
   * Version: 1.0.0
   * Description: This function will reset the password to database.
   */
  public async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId, newPassword } = req.body;

      // Basic validation
      if (!userId || !newPassword) {
        handleResponse(res, 400, "Missing required fields", null, {
          code: "VALIDATION_ERROR",
        });
      }

      const result = await UserService.resetPassword(userId, newPassword);

      if (result.error) {
        handleResponse(res, 400, result.message, {
          code: result.code,
          error: result.error,
        });
      }

      handleResponse(res, 200, "Password reset successfully!", result);
    } catch (err) {
      console.error("AuthController Error:", err);
      handleResponse(
        res,
        500,
        "Failed to reset password due to a server error",
        null,
        error
      );
    }
  }
}

export default new AuthController();
