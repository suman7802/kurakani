import {Request, Response} from 'express';
import {likeModel} from '../models/like';
import catchAsync from '../errors/catchAsync';

export const likeController = {
  addLike: catchAsync(async (req: Request, res: Response) => {
    const {postId} = req.body;
    const userId = req.user?.id;

    await likeModel.createLikes(userId, postId).then((response) => {
      return res.send(response);
    });
  }),

  getLikes: catchAsync(async (req: Request, res: Response) => {
    await likeModel.readLikes().then((response) => {
      return res.json({likeCount: response});
    });
  }),
};
