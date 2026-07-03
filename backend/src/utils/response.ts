import type { Response } from 'express';
import type { ApiResponse } from '@co-dao/shared';

export function success<T>(res: Response, data: T, statusCode = 200): void {
  const body: ApiResponse<T> = { success: true, data };
  res.status(statusCode).json(body);
}

export function error(
  res: Response,
  code: string,
  message: string,
  statusCode = 400,
): void {
  const body: ApiResponse = { success: false, code, message };
  res.status(statusCode).json(body);
}
