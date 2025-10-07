/* *
 * Class Name: Menu Controller
 * Author : Matrix
 * Date: 2025-07-16
 * Version: 1.0.0
 * Description: Handles menu-related operations such as fetching,
 * updating, and deleting menus.
 * This controller interacts with the menu service to perform these operations.
 * The controller returns success or error responses based on the operation's outcome.
 */
// Import necessary modules
import { Request, Response, NextFunction } from "express";
import menuService from "../services/menu.service";
import { handleResponse } from "../utils/responseHandler";

class MenuController {
  constructor() {}

  /**
   * Function Name: createMenu
   * Author : Matrix
   * Date: 2025-07-16
   * Version: 1.0.0
   * Description: This function will create menus.
   */
  async createMenu(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const newMenu = await menuService.createMenu(req.body);
      if (newMenu.error) {
        handleResponse(res, 400, newMenu.message, {
          code: newMenu.code,
          error: newMenu.error,
        });
      }
      handleResponse(res, 201, "Menu registered successfully", newMenu);
    } catch (error) {
      console.error("MenuController Error:", error);
      handleResponse(
        res,
        500,
        "Failed to create menus due to a server error.",
        null,
        error
      );
    }
  }

  /**
   * Function Name: getAllMenus
   * Author : Matrix
   * Date: 2025-07-16
   * Version: 1.0.0
   * Description: Fetches all menus from the database.
   * It uses the menu service to retrieve the users and returns them in the response.
   */
  public async getAllMenus(
    req: Request,
    res: Response,
    next?: NextFunction
  ): Promise<void> {
    try {
      const menus = await menuService.getAllMenus();

      let msg = "No menus found";
      if (Object.keys(menus).length != 0) {
        msg = "Menus fetched successfully";
      }
      handleResponse(res, 200, msg, menus ?? []);
    } catch (error) {
      console.error("MenuController Error:", error);
      handleResponse(
        res,
        500,
        "Failed to fetch menus due to a server error.",
        null,
        error
      );
    }
  }

  /**
   * Function Name: getMenuById
   * Author : Matrix
   * Date: 2025-07-16
   * Version: 1.0.0
   * Description: Fetches one menu by id from the database.
   * It uses the menu service to retrieve one menu and return it.
   */
  async getMenuById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const oneMenu = await menuService.getMenuById(req.params.id);
      if (oneMenu.error) {
        handleResponse(res, 400, oneMenu.message, {
          code: oneMenu.code,
          error: oneMenu.error,
        });
      }
      handleResponse(res, 200, "Menu fetched successfully", oneMenu);
    } catch (error) {
      console.error("MenuController Error:", error);
      handleResponse(
        res,
        500,
        "Failed to fetch menus due to a server error.",
        null,
        error
      );
    }
  }

  /**
   * Function Name: updateMenu
   * Author: Matrix
   * Date: 2025-07-16
   * Version: 1.0.0
   * Description: Updates a menu by ID with the given data.
   */
  async updateMenu(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updatedMenu = await menuService.updateMenu(req.params.id, req.body);
      if (updatedMenu.error) {
        handleResponse(res, 400, updatedMenu.message, {
          code: updatedMenu.code,
          error: updatedMenu.error,
        });
      }
      handleResponse(res, 200, "Menu updated successfully", updatedMenu);
    } catch (error) {
      console.error("MenuController Error:", error);
      handleResponse(
        res,
        500,
        "Failed to update menus due to a server error.",
        null,
        error
      );
    }
  }

  /**
   * Function Name: deleteMenu
   * Author: Matrix
   * Date: 2025-07-16
   * Version: 1.0.0
   * Description: Delete a menu by ID.
   */
  async deleteMenu(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const deleteMenu = await menuService.deleteMenu(req.params.id);
      if (deleteMenu.error) {
        handleResponse(res, 400, deleteMenu.message, {
          code: deleteMenu.code,
          error: deleteMenu.error,
        });
      }
      handleResponse(res, 200, "Menu deleted successfully", deleteMenu);
    } catch (error) {
      console.error("MenuController Error:", error);
      handleResponse(
        res,
        500,
        "Failed to delete menus due to a server error.",
        null,
        error
      );
    }
  }

  /**
   * Function Name: updateMenuStatus
   * Author: Matrix
   * Date: 2025-07-16
   * Version: 1.0.0
   * Description: Update the status of a menu by ID.
   */
  async updateMenuStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const result = await menuService.changeMenuStatus(id, status);

      if (result.error) {
        handleResponse(res, 400, result.message, {
          code: result.code,
          error: result.error,
        });
      }

      handleResponse(res, 200, "Status updated successfully.");
    } catch (error) {
      console.error("MenuController Error:", error);
      handleResponse(
        res,
        500,
        "Failed to update menus status due to a server error.",
        null,
        error
      );
    }
  }
}

export default new MenuController();
