import { getSequelizeForDb } from "../models/Connection";

export const getConnection = (dbName: string) => {
  if (!dbName) {
    throw new Error("No DB selected (dbName is undefined)");
  }

  const sequelize = getSequelizeForDb(dbName);
  return sequelize;
};
