import type { Request, Response, NextFunction } from 'express';
import { error } from '../utils/response.js';
import type { ApiResponse } from '@co-dao/shared';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error('Unhandled error:', err.message);

  const body: ApiResponse = {
    success: false,
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred.',
  };

  res.status(500).json(body);
}

export function notFoundHandler(_req: Request, res: Response): void {
  error(res, 'NOT_FOUND', 'The requested endpoint does not exist.', 404);
}
