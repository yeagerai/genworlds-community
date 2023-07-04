import { ServerError } from '@colyseus/core';
import { ErrorRequestHandler } from 'express';
import { Error } from 'mongoose';

import { logger } from '@app/infra/logger';
import { config } from '@app/config';

import { RestErrorMessage } from './interfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let httpStatus = 500;
  let errorObj: RestErrorMessage = 'Internal Server Error';

  if (error instanceof ServerError) {
    httpStatus = error.code;
    errorObj = error.message;
  } else if (error instanceof Error.ValidationError) {
    httpStatus = 422;
    errorObj = Object.values(error.errors).map((elem) => ({
      attribute: elem.path,
      reason: elem.kind,
    }));
  }
  // console.log(typeof error);
  // console.log(error.constructor.name);

  if (httpStatus === 500 && config.server.logs.showErrors) {
    let message = `Method: ${req.method}; Path: ${req.path}; `;
    if (config.server.logs.showStack) {
      message += `${error.stack}`;
    } else {
      message += `Msg: ${error.message}`;
    }
    logger.error(message);
  }

  res.status(httpStatus).json({
    message: errorObj,
  });
};
