import {Request, Response, NextFunction} from 'express';
import {ApplicationError} from '../errors/application-error';
import {PrismaClient, Prisma} from '@prisma/client';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ApplicationError) {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(400).json({error: 'Title is already taken'});
      }
    }
    res.status(400).json({error: 'Internal Server Error'});
  }
}
