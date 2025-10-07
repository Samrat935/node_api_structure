const dotenv = require('dotenv');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const envFile = path.resolve(__dirname, `../../.env.${env}`);
console.log(`Loading environment variables from: ${envFile}`);

const result = dotenv.config({ path: envFile });
if (result.error) {
  console.error(`Failed to load .env file: ${envFile}`);
  console.error(result.error);
  process.exit(1);
}

const requiredEnvVars = [
  'AWS_RDS_POSTGRES_URI',
  'AWS_RDS_POSTGRES_USERNAME',
  'AWS_RDS_POSTGRES_DB_NAME',
  'AWS_RDS_POSTGRES_PASSWORD',
];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

console.log(missingEnvVars, 'missingEnvVars');

console.log('✅ Environment variables loaded successfully.');

module.exports = {
  development: {
    dialect: 'postgres',
    host: process.env.AWS_RDS_POSTGRES_URI,
    database: process.env.AWS_RDS_POSTGRES_DB_NAME,
    username: process.env.AWS_RDS_POSTGRES_USERNAME,
    password: process.env.AWS_RDS_POSTGRES_PASSWORD,
    port: 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: console.log,
  },
  test: {
    username: process.env.AWS_RDS_POSTGRES_USERNAME,
    password: process.env.AWS_RDS_POSTGRES_PASSWORD,
    database: process.env.AWS_RDS_POSTGRES_DB_NAME,
    host: process.env.AWS_RDS_POSTGRES_URI,
    dialect: 'postgres',
  },
  production: {
    username: process.env.AWS_RDS_POSTGRES_USERNAME,
    password: process.env.AWS_RDS_POSTGRES_PASSWORD,
    database: process.env.AWS_RDS_POSTGRES_DB_NAME,
    host: process.env.AWS_RDS_POSTGRES_URI,
    dialect: 'postgres',
  },
};
