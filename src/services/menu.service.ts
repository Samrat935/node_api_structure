/**
 * Class: Menu Service
 * Author: Matrix
 * Date: 2025-07-14
 * Version: 1.0.0
 * Description: This service handles menu-related operations such as creating, retrieving,
 * updating, and deleting Menus in the database.
 * It uses the Menu model to interact with the database.
 * It provides methods to create a menu, get all menus, get a menu by ID, update a menu, and delete a menu.
 */
import { Sequelize } from "sequelize";
import { initImiMenuModel } from "../models/imi_menu";
import { getConnection } from "../utils/getConnection";

class MenuService {
  constructor() {}
  /**
   * Function Name: createMenu
   * Author: Matrix
   * Date: 2025-07-16
   * Version: 1.0.0
   * Description: Creates a new menu in the database.
   * It uses the Menu model to create a new menu with the provided data.
   */

  public async createMenu(menuData): Promise<any> {
    const sequelize : Sequelize = getConnection(global.db);
    const Menu = initImiMenuModel(sequelize);

    try {
      // Check if menu already exists
      const existingMenu = await Menu.findOne({
        where: { title: menuData.title },
      });
      if (existingMenu) {
        return {
          message: "Menu with this title already exists.",
          error: true,
          code: "MENU_EXISTS",
        };
      }

      const newMenu = await Menu.create(menuData);
      return newMenu;
    } catch (error) {
      console.error("Error in MenuService.createMenu:", error);
      return {
        message: "Failed to create menu. Please try again later.",
        error: true,
        code: "MENU_CREATION_FAILED",
      };
    }
  }

  /**
   * Function Name: getAllMenus
   * Author : Matrix
   * Date: 2025-07-16
   * Version: 1.0.0
   * Description: Fetches all menus from the database.
   * It uses the Menu model to retrieve all menus and returns them.
   */
  public async getAllMenus(): Promise<any[]> {
    const sequelize : Sequelize = getConnection(global.db);
    const Menu = initImiMenuModel(sequelize);

    try {
      const menus = await Menu.findAll();
      return menus;
    } catch (error) {
      console.error("Error in MenuService.getAllMenus:", error);
      throw new Error("Service failed");
    }
  }

  /**
   * Function Name: getMenuById
   * Author : Matrix
   * Date: 2025-07-16
   * Version: 1.0.0
   * Description: Fetches one menu by id from the database.
   * It uses the Menu model to retrieve one menu and return it.
   */
  public async getMenuById(id: string): Promise<any> {
    const sequelize : Sequelize = getConnection(global.db);
    const Menu = initImiMenuModel(sequelize);

    try {
      const menu = await Menu.findByPk(id);
      if (!menu) {
        return {
          message: `Menu with ID ${id} not found.`,
          error: true,
          code: "MENU_NOT_FOUND",
        };
      } else {
        return {
          message: `Menu fetched successfully`,
          error: false,
          code: "SUCCESS",
          data: menu,
        };
      }
      return menu;
    } catch (error) {
      console.error("Error in MenuService.getOneMenu:", error);
      throw new Error("Service failed");
    }
  }

  /**
   * Function Name: updateMenu
   * Author: Matrix
   * Date: 2025-07-16
   * Version: 1.0.0
   * Description: Updates a menu by ID with the given data.
   */
  public async updateMenu(id: string, updateData: any): Promise<any> {
    const sequelize : Sequelize = getConnection(global.db);
    const Menu = initImiMenuModel(sequelize);

    try {
      // Check if the menu exists
      const existingMenu = await Menu.findByPk(id);

      if (!existingMenu) {
        return {
          error: true,
          message: `Menu with ID ${id} not found.`,
          code: "MENU_NOT_FOUND",
        };
      }

      // Update the menu
      await existingMenu.update(updateData);

      return {
        error: false,
        message: "Menu updated successfully.",
        data: existingMenu,
        code: "MENU_UPDATE_SUCCESS",
      };
    } catch (error) {
      console.error("Error in MenuService.updateMenu:", error);

      return {
        error: true,
        message: "Failed to update menu.",
        code: "MENU_UPDATE_FAILED",
      };
    }
  }

  /**
   * Function Name: deleteMenu
   * Author: Matrix
   * Date: 2025-07-16
   * Version: 1.0.0
   * Description: Delete a menu by ID.
   */
  public async deleteMenu(id: string): Promise<any> {
    const sequelize : Sequelize = getConnection(global.db);
    const Menu = initImiMenuModel(sequelize);

    try {
      const existingMenu = await Menu.findByPk(id);

      if (!existingMenu) {
        return {
          error: true,
          message: `Menu with ID ${id} not found.`,
          code: "MENU_NOT_FOUND",
        };
      }

      await existingMenu.destroy();
      return {
        error: false,
        message: `Menu with ID ${id} deleted successfully.`,
        code: "SUCCESS",
      };
    } catch (err) {
      console.error("Error deleting menu:", err);
      return {
        error: true,
        message: "An error occurred while deleting the menu.",
        code: "DELETE_MENU_FAILED",
        details: err,
      };
    }
  }

  /**
   * Function Name: changeMenuStatus
   * Author: Matrix
   * Date: 2025-07-16
   * Version: 1.0.0
   * Description: Change the status of a menu by ID.
   */
  public async changeMenuStatus(id: string, status: boolean): Promise<any> {
    const sequelize : Sequelize = getConnection(global.db);
    const Menu = initImiMenuModel(sequelize);

    try {
      // Find the menu by ID
      const menu = await Menu.findByPk(id);

      if (!menu) {
        return {
          error: true,
          message: `Menu with ID ${id} not found.`,
          code: "MENU_NOT_FOUND",
        };
      }

      // Update status
      menu.status = status;
      await menu.save();

      return {
        error: false,
        message: `Menu status updated to '${status}'.`,
        data: menu,
      };
    } catch (err) {
      console.error("Error changing menu status:", err);
      return {
        error: true,
        message: "An error occurred while updating the menu status.",
        code: "STATUS_UPDATE_FAILED",
        details: err,
      };
    }
  }
}
export default new MenuService();
