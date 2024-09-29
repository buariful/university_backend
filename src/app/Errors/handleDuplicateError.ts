/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err?.message?.match(/"([^"]*)"/);

  const extractMessage = match && match[1];
  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractMessage} is already exists`,
    },
  ];

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleDuplicateError;
