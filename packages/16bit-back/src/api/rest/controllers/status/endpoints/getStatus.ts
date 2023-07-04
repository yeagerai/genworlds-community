import { RequestHandler } from 'express';

export interface ServerStatusResp {
  ip: string;
  timestampMs: number;
}

type MainRequestHandler = RequestHandler<unknown, ServerStatusResp>;

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

export const getStatus = (): Array<RequestHandler> => [
  mainHandler,
];
