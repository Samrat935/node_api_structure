import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || "development";
const envFile = path.resolve(__dirname, `../../.env.${env}`);
dotenv.config({ path: envFile });

const dbMap = new Map<string, Sequelize>();

export const getSequelizeForDb = (dbName: string): Sequelize => {
  if (dbMap.has(dbName)) return dbMap.get(dbName)!;

  const sequelize = new Sequelize({
    dialect: "postgres",
    host: process.env.AWS_RDS_POSTGRES_URI,
    port: 5432,
    database: dbName,
    username: process.env.AWS_RDS_POSTGRES_USERNAME,
    password: process.env.AWS_RDS_POSTGRES_PASSWORD,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });

  // ✅ Connection Test
  sequelize
    .authenticate()
    .then(() => {
      console.log("✅ Database connection has been established successfully.");
    })
    .catch((err) => {
      console.error("❌ Unable to connect to the database:", err.message);
    });

  dbMap.set(dbName, sequelize);
  return sequelize;
};
