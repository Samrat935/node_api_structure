import { Model, DataTypes, Sequelize, Optional } from "sequelize";

// Define attributes
interface ImiMenuAttributes {
  id: number;
  title: string;
  icon: string;
  order_index: number;
  route: string;
  status: boolean;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define optional fields for creation
interface ImiMenuCreationAttributes extends Optional<ImiMenuAttributes, "id"> {}

export class ImiMenu
  extends Model<ImiMenuAttributes, ImiMenuCreationAttributes>
  implements ImiMenuAttributes
{
  public id!: number;
  public title!: string;
  public icon!: string;
  public order_index!: number;
  public route!: string;
  public status!: boolean;
  public type!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Define associations here
    // Example: this.hasMany(models.OtherModel, { foreignKey: 'menu_id' });
  }
}

export const initImiMenuModel = (sequelize: Sequelize) => {
  ImiMenu.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
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
        defaultValue: true, // Default status
      },
      type: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "ImiMenu",
      tableName: "imi_menus",
      timestamps: true,
    }
  );

  return ImiMenu;
};
