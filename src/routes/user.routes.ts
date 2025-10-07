import { Router, Request, Response, NextFunction } from "express";
import UserController from "../controllers/user.controller";
//==================================================
/**
 * @swagger
 * tags:
 *   - name: User Management
 *     description: APIs related to User Management operations
 */

const router: Router = Router();

//===================================================
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users in the system.
 *     tags:
 *       - User Management
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ImiUser'
 *       401:
 *         description: Access denied. Token is required for authentication.
 *
 *       500:
 *         description: Failed to fetch users due to a server error
 */
router.get("/", UserController.getAllUsers);

// ==================================================
/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Change user password
 *     description: Allows a logged-in user to change their password by providing the old and new passwords.
 *     tags:
 *       - User Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: "OldPassword@123"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword@456"
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: Your password has been changed successfully.
 *                     code:
 *                       type: string
 *                       example: PASSWORD_CHANGED_SUCCESSFULLY
 *       400:
 *         description: Validation Error - Invalid input data or Old password
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
 *                   example: Incorrect old password.
 *                 code:
 *                   type: string
 *                   example: INVALID_OLD_PASSWORD
 *       401:
 *         description: Access denied. Token is required for authentication.
 *       500:
 *         description: Failed to fetch users due to a server error
 */
router.post("/change-password", UserController.changePassword);

export default router;
