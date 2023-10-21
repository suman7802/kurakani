import {Request, Response} from 'express';
import {getCreateUser} from '../models/user';
import catchAsync from '../utils/catchAsync';

export const userController = {
  user: catchAsync(async (req: Request, res: Response) => {
    const email = req.body.email;
    await getCreateUser(email).then((response) => {
      return res.send(response);
    });
  }),
};
