import { Response } from 'express';

interface ResponseOptions {
    statusCode?: number;
    message?: string;
    data?: any;
    error?: string | object;
}

// Common response function with improved error handling and messaging
export const sendResponse = (res: Response, options: ResponseOptions): void => {
    const {
        statusCode = 200,
        message = statusCode >= 400 ? 'An error occurred' : 'Request successful',
        data = null,
        error = null,
    } = options;

    if (statusCode >= 400) {
        // Handle error response
        res.status(statusCode).json({
            success: false,
            message: typeof error === 'string' ? error : message,
            error: error || null,
        });
    } else {
        // Handle success response
        res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
};
