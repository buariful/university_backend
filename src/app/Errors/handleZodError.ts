import { ZodError, ZodIssue } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err?.issues?.map((issue: ZodIssue) => {
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

export default handleZodError;
