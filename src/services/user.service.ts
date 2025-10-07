/**
 * Class: User Service
 * Author: Matrix
 * Date: 2025-07-14
 * Version: 1.0.0
 * Description: This service handles user-related operations such as creating, retrieving,
 * updating, and deleting users in the database.
 * It uses the User model to interact with the database.
 * It provides methods to create a user, get all users, get a user by ID, update a user, and delete a user.
 */
// Import User Model
import { Sequelize } from "sequelize";
import { initImiUserModel } from "../models/imi_user";
import { initPasswordResetModel } from "../models/imi_password_resets";
import { initImiUserLoginSessionModel } from "../models/imi_user_login_session";
import { getConnection } from "../utils/getConnection";
import bcrypt from "bcrypt";
import { error } from "console";
import { encryptToken, compareToken } from "../helper/bcryptHelper";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

class UserService {
  constructor() {}
  /**
   * Function Name: loginUser
   * Author: Matrix
   * Date: 2025-07-14
   * Version: 1.0.0
   * Description: Authenticates a user by checking the email and password.
   * Returns detailed error messages for different failure scenarios.
   */
  public async loginUser(
    email: string,
    password: string,
    ipAddress: string
  ): Promise<any> {
    const sequelize : Sequelize = getConnection(global.db);
    const User = initImiUserModel(sequelize);

    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        // User not found
        return {
          message:
            "Authentication failed: User with the provided email does not exist.",
          error: true,
          code: "USER_NOT_FOUND",
        };
      }

      // Compare provided password with stored hash
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        // Invalid password
        return {
          message: "Authentication failed: Incorrect password.",
          error: true,
          code: "INVALID_PASSWORD",
        };
      }

      // user last login ip address and last login date info save to database
      user.last_login_ip_address = ipAddress;
      user.last_login_date = new Date();

      await user.save(); // Save changes to DB

      // Authentication successful
      return {
        message: "Authentication successful.",
        error: false,
        user,
        code: "SUCCESS",
      };
    } catch (error) {
      // Unexpected error during authentication
      console.error("Error in UserService.loginUser:", error);
      return {
        message: "Authentication failed: An unexpected error occurred.",
        error: true,
        code: "AUTH_ERROR",
      };
    }
  }

  /**
   * Function Name: loginSessionCreate
   * Author: Matrix
   * Date: 2025-07-16
   * Version: 1.0.0
   * Description: store user login session.
   */

  public async loginSessionCreate(data: any) {
    const sequelize : Sequelize = getConnection(global.db);
    const ImiUserLoginSession = initImiUserLoginSessionModel(sequelize);

    const existingSession = await ImiUserLoginSession.findOne({
      where: {
        user_id: data.user_id,
        token: data.token,
      },
    });

    if (existingSession) {
      await existingSession.update(data);
      return existingSession;
    } else {
      return await ImiUserLoginSession.create(data);
    }
  }

  /**
   * Function Name: getSession
   * Author: Matrix
   * Date: 2025-07-16
   * Version: 1.0.0
   * Description: get user login session by token.
   */

  public async getSession(token: string) {
    const sequelize : Sequelize = getConnection(global.db);
    const ImiUserLoginSession = initImiUserLoginSessionModel(sequelize);
    return await ImiUserLoginSession.findOne({
      where: {
        token: token,
      },
    });
  }

  /**
   * Function Name: delSession
   * Author: Matrix
   * Date: 2025-07-16
   * Version: 1.0.0
   * Description: delete user login session by token.
   */

  public async delSession(token: string) {
    const sequelize : Sequelize = getConnection(global.db);
    const ImiUserLoginSession = initImiUserLoginSessionModel(sequelize);

    const existingSession = await ImiUserLoginSession.findOne({
      where: {
        token: token,
      },
    });

    if (existingSession) {
      await existingSession.destroy();
      return { message: "Session deleted successfully" };
    } else {
      return { message: "No session found to delete" };
    }
  }

  /**
   * Function Name: createUser
   * Author: Matrix
   * Date: 2025-07-14
   * Version: 1.0.0
   * Description: Creates a new user in the database.
   * It uses the User model to create a new user with the provided data.
   */

  public async createUser(userData): Promise<any> {
    const sequelize : Sequelize = getConnection(global.db);
    const User = initImiUserModel(sequelize);

    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email: userData.email },
      });
      if (existingUser) {
        return {
          message: "User with this email already exists.",
          error: true,
          code: "USER_EXISTS",
        };
      }
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      const newUser = await User.create(userData);
      return newUser;
    } catch (error) {
      console.error("Error in UserService.createUser:", error);
      throw new Error("Service failed");
    }
  }

  /**
   * Function Name: getAllUsers
   * Author : Matrix
   * Date: 2025-07-14
   * Version: 1.0.0
   * Description: Fetches all users from the database.
   * It uses the User model to retrieve all users and returns them.
   */

  public async getAllUsers(): Promise<any[]> {
    const sequelize : Sequelize = getConnection(global.db);
    const User = initImiUserModel(sequelize);

    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      console.error("Error in UserService.getAllUsers:", error);
      throw new Error("Service failed");
    }
  }

  /**
   * Function Name: forgetPassword
   * Author : Matrix
   * Date: 2025-07-17
   * Version: 1.0.0
   * Description: Fetche user account for sending mail with reset password link.
   */
  public async forgetPassword(userData): Promise<any> {
    const sequelize : Sequelize = getConnection(global.db);
    const User = initImiUserModel(sequelize);
    const PasswordReset = initPasswordResetModel(sequelize);
    try {
      const user = await User.findOne({ where: { email: userData.email } });

      if (!user) {
        return {
          error: true,
          message: "No account found with the provided email address.",
          code: "USER_NOT_FOUND",
        };
      }

      // Step 1: Generate raw token
      const rawToken = uuidv4(); // or: `${user.email}-${Date.now()}`

      // Step 2: Encrypt the token
      const hashedToken = await encryptToken(rawToken);

      // Step 3: Store in password reset table
      await PasswordReset.create({
        user_id: user.id,
        password_reset_token: hashedToken,
      });

      return {
        error: false,
        data: {
          userData: user,
          token: hashedToken,
        },
        code: "RESET_TOKEN_GENERATED",
      };
    } catch (error) {
      console.error("Error in UserService.forgetPassword:", error);
      return {
        error: true,
        message: "An unexpected error occurred while processing the request.",
        code: "SERVICE_ERROR",
      };
    }
  }

  /**
   * Function Name: verifyResetToken
   * Author : Matrix
   * Date: 2025-07-17
   * Version: 1.0.0
   * Description: This function will verify password reset token.
   */

  public async verifyResetToken(rawToken: string): Promise<any> {
    const sequelize : Sequelize = getConnection(global.db);
    const PasswordReset = initPasswordResetModel(sequelize);
    const User = initImiUserModel(sequelize);

    try {
      const resetEntry = await PasswordReset.findOne({
        where: { password_reset_token: rawToken },
        order: [["created_at", "DESC"]],
      });

      //console.log(resetEntry);

      if (!resetEntry && resetEntry == null) {
        return {
          error: true,
          message:
            "Your password reset request is invalid or has expired. Please request a new one.",
          code: "TOKEN_NOT_FOUND",
        };
      }

      const tokenCreatedAt = dayjs(resetEntry.created_at);
      const now = dayjs();
      const diffMinutes = now.diff(tokenCreatedAt, "minute");

      if (diffMinutes > 30) {
        return {
          error: true,
          message:
            "Your password reset link has expired. Please request a new one to continue.",
          code: "TOKEN_EXPIRED",
        };
      }

      const user = await User.findOne({ where: { id: resetEntry.user_id } });

      return {
        error: false,
        message: "Valid token. You may proceed to reset your password.",
        userData: user,
        code: "TOKEN_VALID",
      };
    } catch (error) {
      console.error("AuthService.verifyResetToken error:", error);
      return {
        error: true,
        message: "Internal server error.",
        code: "SERVER_ERROR",
      };
    }
  }

  /**
   * Function Name: resetPassword
   * Author : Matrix
   * Date: 2025-07-17
   * Version: 1.0.0
   * Description: This function will reset the password.
   */
  public async resetPassword(
    userId: number,
    newPassword: string
  ): Promise<any> {
    const sequelize : Sequelize = getConnection(global.db);
    const User = initImiUserModel(sequelize);
    console.log(userId);
    try {
      // Find user by ID
      const user = await User.findByPk(userId);
      if (!user) {
        return {
          error: true,
          message: "User not found. Please check your details and try again.",
          code: "USER_NOT_FOUND",
        };
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await User.update(
        { password: hashedPassword },
        { where: { id: userId } }
      );

      return {
        error: false,
        message: "Password updated successfully.",
        code: "PASSWORD_RESET_SUCCESS",
      };
    } catch (error) {
      console.error("Error in UserService.resetPassword:", error);
      return {
        error: true,
        message: "An error occurred while resetting the password.",
        code: "PASSWORD_RESET_ERROR",
      };
    }
  }

  /**
   * Function Name: changePassword
   * Author : Matrix
   * Date: 2025-07-18
   * Version: 1.0.1
   * Description: Changes the user's password after validating the old password.
   */
  public async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ): Promise<any> {
    const sequelize : Sequelize = getConnection(global.db);
    const User = initImiUserModel(sequelize);

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return {
          error: true,
          message: "User not found. Please verify your account and try again.",
          code: "USER_NOT_FOUND",
        };
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return {
          error: true,
          message: "The current password you entered is incorrect.",
          code: "INVALID_OLD_PASSWORD",
        };
      }

      if (oldPassword === newPassword) {
        return {
          error: true,
          message: "The new password must be different from the old password.",
          code: "PASSWORD_SAME_AS_OLD",
        };
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedNewPassword });

      //==============================================
      //user by force logout

      return {
        error: false,
        message: "Your password has been changed successfully.",
        code: "PASSWORD_CHANGED_SUCCESSFULLY",
      };
      
    } catch (err) {
      console.error("Error in UserService.changePassword:", err);
      return {
        error: true,
        message:
          "An unexpected error occurred while changing the password. Please try again later.",
        code: "CHANGE_PASSWORD_ERROR",
      };
    }
  }
}

export default new UserService();
