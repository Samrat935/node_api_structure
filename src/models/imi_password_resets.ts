import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";

export interface PasswordResetAttributes {
  id: number;
  user_id: number;
  password_reset_token: string;
  created_at?: Date;
  updated_at?: Date;
}

export class PasswordReset
  extends Model<
    InferAttributes<PasswordReset>,
    InferCreationAttributes<PasswordReset>
  >
  implements PasswordResetAttributes
{
  declare id: CreationOptional<number>;
  declare user_id: ForeignKey<number>;
  declare password_reset_token: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export function initPasswordResetModel(
  sequelize: Sequelize
): typeof PasswordReset {
  PasswordReset.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      password_reset_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "imi_password_resets",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return PasswordReset;
}
