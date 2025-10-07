import { Router, Request, Response, NextFunction } from "express";
import authController from "../controllers/auth.controller";
import UserController from "../controllers/user.controller";
import verifyToken from "../middlewares/verifyTokenMiddleware";
//==================================================
/**
 * @swagger
 * tags:
 *   - name: User Authentication
 * description: APIs related to User Authentication operations
 */
const router: Router = Router();

//===================================================
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User Authentication
 *     description: Register a new user with the specified details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - user_type
 *               - type
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: User's first name
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 description: User's last name
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 format: email
 *                 example: "john@gmail.com"
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: "password123"
 *               user_type:
 *                 type: string
 *                 description: Type of user (e.g., frontend, admin)
 *                 example: "frontend"
 *               type:
 *                 type: string
 *                 description: User category (e.g., student, teacher, recruiter, admin, superadmin)
 *                 example: "student"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImiUser'
 *       400:
 *         description: Validation Error - Invalid input data
 *       500:
 *         description: Failed to create user due to a server error.
 */

router.post("/register", authController.userRegistration);

//===================================================
/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout
 *     description: Logs out the user by invalidating the session or token.
 *     tags:
 *       - User Authentication
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User has been logged out successfully.
 *       500:
 *         description: Failed to logout due to a server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to logout user due to a server error.
 */
router.get("/logout", UserController.userLogout);
//===================================================
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User Login
 *     tags:
 *       - User Authentication
 *     description: User login with email and password. Returns JWT token and user information on success.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's registered email address.
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: User's account password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful - JWT token and user data returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authentication successful.
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT token for authenticated user.
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     userData:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: Authentication successful.
 *                         error:
 *                           type: boolean
 *                           example: false
 *                         code:
 *                           type: string
 *                           example: SUCCESS
 *                         user:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 6
 *                             first_name:
 *                               type: string
 *                               example: John
 *                             last_name:
 *                               type: string
 *                               example: Doe
 *                             email:
 *                               type: string
 *                               example: dilipabc1@gmail.com
 *                             password:
 *                               type: string
 *                               example: $2b$10$tIQ854FQL5m...
 *                             user_type:
 *                               type: string
 *                               example: frontend
 *                             type:
 *                               type: string
 *                               example: student
 *                             is_active:
 *                               type: boolean
 *                               example: true
 *                             last_login_date:
 *                               type: string
 *                               nullable: true
 *                               example: null
 *                             last_login_ip_address:
 *                               type: string
 *                               nullable: true
 *                               example: null
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: 2025-07-16T09:19:40.067Z
 *                             updatedAt:
 *                               type: string
 *                               format: date-time
 *                               example: 2025-07-16T09:19:40.067Z
 *       400:
 *         description: Validation Error - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation Error - Invalid input data
 *       500:
 *         description: Internal Server Error - Failed to login user due to server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to login due to a server error
 */
router.post("/login", authController.userLogin);

//=======================================================

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Initiate password reset process
 *     description: Sends a password reset email to the user with a reset link or token.
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset link has been sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset instructions have been sent to your email
 *       400:
 *         description: Missing or invalid email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation Error - Invalid input data
 *       500:
 *         description: Failed to generate reset instructions due to a server error
 */
router.post("/forgot-password", authController.forgetPassword);
//====================================================================

/**
 * @swagger
 * /auth/verify-reset-token:
 *   post:
 *     summary: Verify password reset token
 *     description: Verifies if the provided password reset token is valid for the given user. Token is valid for 30 minutes after creation.
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Raw token received by the user
 *                 example: "abcdefg123456"
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Valid token. You may proceed to reset your password
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Validation Error - Invalid input data
 *       500:
 *         description: Failed to verify token due to a server error
 */
router.post("/verify-reset-token", authController.verifyResetToken);
//======================================================================
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user's password
 *     description: Allows a user to reset their password using a valid user ID and new password.
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - newPassword
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 123
 *                 description: The ID of the user whose password is to be reset.
 *               newPassword:
 *                 type: string
 *                 example: NewStrongPassword@123
 *                 description: The new password for the user.
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Password has been reset successfully.
 *       400:
 *         description: Validation error or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Validation Error - Invalid input data
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Failed to set new password due to a server error
 */
router.post("/reset-password", authController.resetPassword);

export default router;
