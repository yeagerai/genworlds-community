import { RequestHandler } from 'express';

import { checkAuth } from '@app/api/rest/middlewares/checkAuth';

export interface ServerExtraStatusResp {
  ip: string;
  timestampMs: number;
}

type MainRequestHandler = RequestHandler<unknown, ServerExtraStatusResp>;

// =============================================================================

const mainHandler: MainRequestHandler = async (req, res, next) => {
  try {
    const dateNow = new Date().getTime();
    res.status(200).json({
      ip: req.ip,
      timestampMs: dateNow,
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================

export const getExtraStatus = (): Array<RequestHandler> => [
  checkAuth,
  mainHandler,
];
