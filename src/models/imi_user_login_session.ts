import { Model, DataTypes, Optional, Sequelize } from "sequelize";

interface ImiUserLoginSessionAttributes {
  id: number;
  user_id: number;
  token: string;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ImiUserLoginSessionCreationAttributes
  extends Optional<ImiUserLoginSessionAttributes, "id"> {}

export class ImiUserLoginSession
  extends Model<
    ImiUserLoginSessionAttributes,
    ImiUserLoginSessionCreationAttributes
  >
  implements ImiUserLoginSessionAttributes
{
  public id!: number;
  public user_id!: number;
  public token!: string;
  public is_active!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initImiUserLoginSessionModel = (sequelize: Sequelize) => {
  ImiUserLoginSession.init(
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
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "ImiUserLoginSession",
      tableName: "imi_user_login_sessions",
      timestamps: true,
    }
  );

  return ImiUserLoginSession;
};
