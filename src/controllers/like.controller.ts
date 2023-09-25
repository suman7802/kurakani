import {Request, Response} from 'express';
import {likeModel} from '../models/like';
import catchAsync from '../utils/catchAsync';

export const likeController = {
  addLike: catchAsync(async (req: Request, res: Response) => {
    const {postId} = req.body;
    const userId = req.user?.id;

    await likeModel
      .createLikes(userId, postId)
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        throw err;
      });
  }),

  getLikes: catchAsync(async (req: Request, res: Response) => {
    await likeModel
      .readLikes()
      .then((response) => {
        return res.json({likeCount: response});
      })
      .catch((error) => {
        throw error;
      });
  }),
};
