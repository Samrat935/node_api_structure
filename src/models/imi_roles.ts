import { Model, DataTypes, Optional, Sequelize } from "sequelize";

interface ImiRoleAttributes {
  id: number;
  title: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ImiRoleCreationAttributes extends Optional<ImiRoleAttributes, "id"> {}

export class ImiRole
  extends Model<ImiRoleAttributes, ImiRoleCreationAttributes>
  implements ImiRoleAttributes
{
  public id!: number;
  public title!: string;
  public status!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Define associations here (if any in future)
  }
}

export const initImiRoleModel = (sequelize: Sequelize) => {
  ImiRole.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "ImiRole",
      tableName: "imi_role",
      timestamps: true,
    }
  );

  return ImiRole;
};
