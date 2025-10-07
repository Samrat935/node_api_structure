// src/utils/responseHandler.ts
import { Response } from 'express';

interface ResponsePayload {
  message: string;
  data?: any;
  error?: any;
}

export const handleResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any = null,
  error: any = null
): void => {
  const responsePayload: ResponsePayload = {
    message,
    ...(data && { data }),
    ...(error && { error: formatError(error) }),
  };

  res.status(statusCode).json(responsePayload);
};

const formatError = (error: any): string | object => {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }
  return typeof error === 'string' ? error : 'An unexpected error occurred';
};