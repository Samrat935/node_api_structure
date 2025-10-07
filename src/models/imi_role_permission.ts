import { Model, DataTypes, Optional, Sequelize } from "sequelize";

interface ImiRolePermissionAttributes {
  id: number;
  role_id: number;
  menu_id: number;
  sub_menu_id?: number;
  can_view: boolean;
  can_edit: boolean;
  can_add: boolean;
  can_del: boolean;
  can_status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ImiRolePermissionCreationAttributes
  extends Optional<ImiRolePermissionAttributes, "id"> {}

export class ImiRolePermission
  extends Model<
    ImiRolePermissionAttributes,
    ImiRolePermissionCreationAttributes
  >
  implements ImiRolePermissionAttributes
{
  public id!: number;
  public role_id!: number;
  public menu_id!: number;
  public sub_menu_id?: number;
  public can_view!: boolean;
  public can_edit!: boolean;
  public can_add!: boolean;
  public can_del!: boolean;
  public can_status!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    ImiRolePermission.belongsTo(models.ImiRole, {
      foreignKey: "role_id",
      as: "role",
    });
    ImiRolePermission.belongsTo(models.ImiMenu, {
      foreignKey: "menu_id",
      as: "menu",
    });
    ImiRolePermission.belongsTo(models.ImiSubmenu, {
      foreignKey: "sub_menu_id",
      as: "submenu",
    });
  }
}

export const initImiRolePermissionModel = (sequelize: Sequelize) => {
  ImiRolePermission.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      menu_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      sub_menu_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      can_view: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      can_edit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      can_add: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      can_del: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      can_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ImiRolePermission",
      tableName: "imi_role_permission",
      timestamps: true,
    }
  );

  return ImiRolePermission;
};
