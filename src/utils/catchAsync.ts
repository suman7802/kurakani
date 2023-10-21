import {NextFunction, Request, Response} from 'express';

type controllerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
export default (fn: controllerFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err) => {
      console.log(err);
      next(err);
    });
  };
};
