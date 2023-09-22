import {Request, Response, NextFunction} from 'express';
export function authentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send('not authenticate');
  }
}
