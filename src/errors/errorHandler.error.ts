import {Request, Response, NextFunction} from 'express';
import {serverError} from './serverError.error';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof serverError) {
    const {message, status} = error;
    res.status(status).json({error: message});
  } else {
    res.status(500).json({error: 'Internal server error'});
  }
}
