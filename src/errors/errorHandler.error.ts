import {Request, Response, NextFunction} from 'express';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error) {
    res.status(500).send(error.message);
  }
}
