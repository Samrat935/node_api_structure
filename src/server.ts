// Import required modules
import express, { Application } from 'express';
import app from "./app";

// Define the port the server will listen on
const PORT = process.env.PORT || 5000;

/**
 * Starts the Express server.
 * Handles errors during startup and logs server status.
 */
const startServer = async (): Promise<void> => {
    try {
        // Start listening for incoming requests
        app.listen(PORT, () => {
            console.log(`Server running at PORT ${PORT}`);
        });
    } catch (error: any) {
        // Log any errors and exit the process
        console.error(`Error starting the server: ${error.message}`);
        process.exit(1);
    }
};

// Initialize the server
startServer();