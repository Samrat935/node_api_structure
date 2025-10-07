// loadEnv.ts
// This script loads environment variables from a .env file based on the current NODE_ENV.
// It ensures that the environment variables are loaded before starting the server.

import dotenv from "dotenv";
import path from "path";

// Determine the current environment (default to 'development' if not set)
const env = process.env.NODE_ENV || "development";

// Construct the path to the appropriate .env file (e.g., .env.development)
const envFile = `.env.${env}`;
const envPath = path.resolve(__dirname, `../${envFile}`);

try {
  // Attempt to load environment variables from the specified file
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    // Throw an error if loading fails
    throw new Error(
      `Failed to load environment file: ${envFile}. Error: ${result.error.message}`
    );
  }

  console.log(`Environment variables loaded from ${envFile}`);
} catch (error) {
  // Log the error and exit the process with a failure code
  console.error(
    `Error loading environment variables: ${(error as Error).message}`
  );
  process.exit(1);
}

// Import and start the server after environment variables are loaded
import "./server";
