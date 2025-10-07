import { Model, DataTypes, Optional, Sequelize } from "sequelize";

interface ImiSubmenuAttributes {
  id: number;
  menu_id: number;
  title: string;
  icon?: string;
  order_index?: number;
  status: boolean;
  route?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ImiSubmenuCreationAttributes
  extends Optional<ImiSubmenuAttributes, "id"> {}

export class ImiSubmenu
  extends Model<ImiSubmenuAttributes, ImiSubmenuCreationAttributes>
  implements ImiSubmenuAttributes
{
  public id!: number;
  public menu_id!: number;
  public title!: string;
  public icon?: string;
  public order_index?: number;
  public status!: boolean;
  public route?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Example association: belongsTo menu
    ImiSubmenu.belongsTo(models.ImiMenu, {
      foreignKey: "menu_id",
      as: "menu",
    });
  }
}

export const initImiSubmenuModel = (sequelize: Sequelize) => {
  ImiSubmenu.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      menu_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null for icon
      },
      order_index: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // Default order index
      },
      route: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "ImiSubmenu",
      tableName: "imi_submenu",
      timestamps: true,
    }
  );

  return ImiSubmenu;
};
