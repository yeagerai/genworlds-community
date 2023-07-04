import { ServerError } from '@colyseus/core';
import { RequestHandler } from 'express';

import { config } from '@app/config';

export const checkAuth: RequestHandler = async (req, res, next) => {
  if (!req.headers || !req.headers.authorization) {
    return next(new ServerError(401, 'Unauthorized'));
  }
  const parts = req.headers.authorization.split(' ');
  if (parts.length !== 2) {
    return next(new ServerError(401, 'Unauthorized'));
  }
  const scheme = parts[0];
  let authStrategy = '';
  if (/^Secret$/i.test(scheme)) {
    authStrategy = 'app_secret';
  } else if (/^Bearer$/i.test(scheme)) {
    authStrategy = 'bearer';
  }
  const token = parts[1];

  if (authStrategy === 'app_secret') {
    if (token !== config.auth.secretKey) {
      return next(new ServerError(401, 'Unauthorized'));
    }
  } else {
    return next(new ServerError(401, 'Unauthorized'));
  }

  req.authToken = token;

  return next();
};
