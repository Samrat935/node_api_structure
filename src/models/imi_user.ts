import { Model, DataTypes, Optional, Sequelize } from "sequelize";

export type UserType = "admin" | "frontend";
export type UserCategory =
  | "student"
  | "teacher"
  | "recruiter"
  | "admin"
  | "superadmin";

interface ImiUserAttributes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_type: UserType;
  type: UserCategory;
  is_active: boolean;
  last_login_date?: Date;
  last_login_ip_address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ImiUserCreationAttributes extends Optional<ImiUserAttributes, "id"> {}

export class ImiUser
  extends Model<ImiUserAttributes, ImiUserCreationAttributes>
  implements ImiUserAttributes
{
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public password!: string;
  public user_type!: UserType;
  public type!: UserCategory;
  public is_active!: boolean;
  public last_login_date?: Date;
  public last_login_ip_address?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initImiUserModel = (sequelize: Sequelize) => {
  ImiUser.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null for first_name
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null for last_name
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      user_type: {
        type: DataTypes.ENUM("admin", "frontend"),
        allowNull: false,
        defaultValue: "frontend", // Default user type
      },
      type: {
        type: DataTypes.ENUM(
          "student",
          "teacher",
          "recruiter",
          "admin",
          "superadmin"
        ),
        allowNull: false,
        defaultValue: "student", // Default user type
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      last_login_date: {
        type: DataTypes.DATE,
        allowNull: true, // Allow null for last_login_date
      },
      last_login_ip_address: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null for last_login_ip_address
      },
    },
    {
      sequelize,
      modelName: "ImiUser",
      tableName: "imi_users",
      timestamps: true,
    }
  );

  return ImiUser;
};
