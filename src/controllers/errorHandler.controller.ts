import {Request, Response, NextFunction} from 'express';
import {ApplicationError} from '../errors/application-error';
import {Prisma} from '@prisma/client';

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
      //@ts-ignore
      if (error.meta?.target[0] === 'title') {
        res.status(406).json({error: 'Title is already taken'});
      }
    }
    if (error.name === 'PrismaClientValidationError') {
      res.json({
        error: 'Missing argument',
      });
    }
    console.log(error);
    res.status(400).json({error: 'Internal Server Error'});
  }
}
