import {Request, Response} from 'express';
import {getCreateUser} from '../models/user';
import catchAsync from '../errors/catchAsync';

export const userController = {
  user: catchAsync(async (req: Request, res: Response) => {
    const email = req.body.email;
    await getCreateUser(email).then((response) => {
      return res.send(response);
    });
  }),

  logout: (req: Request, res: Response) => {
    req.logout({}, (error) => {
      res.send(error);
    });
    res.redirect('/logout');
  },
};
