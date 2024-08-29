import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

export const notFound = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars,, @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Not Found !',
    error: '',
  });
};
