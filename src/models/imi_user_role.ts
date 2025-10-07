import { Model, DataTypes, Optional, Sequelize } from "sequelize";

interface ImiUserRoleAttributes {
  id: number;
  user_id: number;
  role_id: number;
  assigned_at?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ImiUserRoleCreationAttributes
  extends Optional<ImiUserRoleAttributes, "id"> {}

export class ImiUserRole
  extends Model<ImiUserRoleAttributes, ImiUserRoleCreationAttributes>
  implements ImiUserRoleAttributes
{
  public id!: number;
  public user_id!: number;
  public role_id!: number;
  public assigned_at?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    ImiUserRole.belongsTo(models.ImiUser, {
      foreignKey: "user_id",
      as: "user",
    });
    ImiUserRole.belongsTo(models.ImiRole, {
      foreignKey: "role_id",
      as: "role",
    });
  }
}

export const initImiUserRoleModel = (sequelize: Sequelize) => {
  ImiUserRole.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      assigned_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ImiUserRole",
      tableName: "imi_user_roles",
      timestamps: true,
    }
  );

  return ImiUserRole;
};
