/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { TErrorSource } from '../app/interface/error';
import { ZodError, ZodIssue } from 'zod';
import config from '../app/config';

export const globalErrorMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  let errorSources: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  const handleZodError = (err: ZodError) => {
    const errorSources: TErrorSource = err?.issues?.map((issue: ZodIssue) => {
      return {
        message: issue?.message,
        path: issue?.path[issue?.path?.length - 1],
      };
    });

    return {
      statusCode: 400,
      message: 'Validation Error',
      errorSources,
    };
  };

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    statck: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};
