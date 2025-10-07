import { Router, Request, Response, NextFunction } from "express";
import MenuController from "../controllers/menu.controller";
import menuController from "../controllers/menu.controller";
//==================================================
/**
 * @swagger
 * tags:
 *   - name: Menu Management
 *     description: APIs related to Menu Management operations
 */
const router: Router = Router();
//===================================================
/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Register a new menu
 *     tags:
 *       - Menu Management
 *     description: Register a new menu with the specified details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - order_index
 *               - route
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the menu
 *                 example: "Dashboard"
 *               icon:
 *                 type: string
 *                 description: Icon class or URL
 *                 example: "fa fa-dashboard"
 *               order_index:
 *                 type: integer
 *                 description: Order or position of the menu
 *                 example: 1
 *               route:
 *                 type: string
 *                 description: Route or path for the menu
 *                 example: "/dashboard"
 *               status:
 *                 type: boolean
 *                 description: Whether the menu is active
 *                 example: true
 *               type:
 *                 type: string
 *                 description: Type/category of the menu
 *                 example: "admin"
 *     responses:
 *       201:
 *         description: Menu registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImiMenu'
 *       401:
 *         description: Access denied. Token is required for authentication.
 *       500:
 *         description: Failed to create menus due to a server error
 */

router.post("/", MenuController.createMenu);

//===================================================
/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Get all menus
 *     description: Retrieve a list of all menus in the system.
 *     tags:
 *       - Menu Management
 *     responses:
 *       200:
 *         description: List of menus
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ImiMenu'
 *       500:
 *         description: Failed to fetch menus due to a server error
 */
router.get("/", MenuController.getAllMenus);

// ==================================================
/**
 * @swagger
 * /menu/{id}:
 *   get:
 *     summary: Get a single menu by ID
 *     description: Retrieve details of a specific menu by its ID.
 *     tags:
 *       - Menu Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the menu to retrieve
 *     responses:
 *       200:
 *         description: Menu found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImiMenu'
 *       400:
 *         description: Validation Error - Invalid input data 
 *       401:
 *         description: Access denied. Token is required for authentication.
 *       500:
 *         description: Failed to fetch menus due to a server error
 */
router.get("/:id", MenuController.getMenuById);

// ==================================================
/**
 * @swagger
 * /menu/{id}:
 *   put:
 *     summary: Update an existing menu
 *     description: Update the details of a specific menu using its ID.
 *     tags:
 *       - Menu Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the menu to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the menu
 *                 example: "Updated Dashboard"
 *               icon:
 *                 type: string
 *                 description: Icon class or URL
 *                 example: "fa fa-chart"
 *               order_index:
 *                 type: integer
 *                 description: Order or position of the menu
 *                 example: 2
 *               route:
 *                 type: string
 *                 description: Route or path for the menu
 *                 example: "/analytics"
 *               status:
 *               type:
 *                 type: string
 *                 description: Type or category of the menu
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Menu updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImiMenu'
 *       400:
 *         description: Validation Error - Invalid input data 
 *       401:
 *         description: Access denied. Token is required for authentication.
 *       500:
 *         description: Failed to update menus due to a server error.
 */
router.put("/:id", MenuController.updateMenu);
//==================================================================
/**
 * @swagger
 * /menu/{id}:
 *   delete:
 *     summary: Delete a menu by ID
 *     description: Deletes a specific menu from the database using its ID.
 *     tags:
 *       - Menu Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the menu to delete
 *     responses:
 *       200:
 *         description: Menu deleted successfully
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
 *                   example: Menu with ID 1 deleted successfully.
 *       400:
 *         description: Validation Error - Invalid input data 
 *       401:
 *         description: Access denied. Token is required for authentication.
 *       500:
 *         description: Failed to delete menus due to a server error
 */
router.delete("/:id", MenuController.deleteMenu);
//=====================================================================

/**
 * @swagger
 * /menu/{id}/status:
 *   patch:
 *     summary: Change menu status
 *     description: Update the status (e.g., active/inactive) of a menu by ID.
 *     tags:
 *       - Menu Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the menu to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: true
 *                 description: New status of the menu (e.g., active/inactive)
 *     responses:
 *       200:
 *         description: Menu status updated successfully
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
 *                   example: Menu status updated to 'true'.
 *                 data:
 *                   $ref: '#/components/schemas/ImiMenu'
 *       400:
 *         description: Validation Error - Invalid input data 
 *       401:
 *         description: Access denied. Token is required for authentication.
 *       500:
 *         description: Failed to update menus status due to a server error.
 */
router.patch("/:id/status", MenuController.updateMenuStatus);

export default router;
