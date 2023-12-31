import {Request, Response} from 'express';
import {commentModel} from '../models/comment';
import catchAsync from '../errors/catchAsync';

export const commentController = {
  addComment: catchAsync(async (req: Request, res: Response) => {
    const {comment, postId} = req.body;
    const userId = req.user?.id;
    await commentModel
      .createComment(comment, userId, postId)
      .then((response) => {
        return res.send(response);
      });
  }),

  CreateCommentReply: catchAsync(async (req: Request, res: Response) => {
    const {comment, postId, commentId} = req.body;
    const userId: any = req.user?.id;

    await commentModel
      .createCommentReply(userId, postId, commentId, comment)
      .then((response) => {
        return res.send(response);
      });
  }),

  getComments: catchAsync(async (req: Request, res: Response) => {
    await commentModel.readComments().then((response) => {
      return res.send(response);
    });
  }),

  updateComment: catchAsync(async (req: Request, res: Response) => {
    const {id, postId, comment} = req.body;
    const userId = req.user?.id;
    await commentModel
      .updateComment(id, userId, postId, comment)
      .then((response) => {
        res.send(response);
      });
  }),

  deleteComment: catchAsync(async (req: Request, res: Response) => {
    const {id, postId} = req.body;
    const userId = req.user?.id;
    await commentModel.deleteComment(id, postId, userId).then((response) => {
      res.send(response);
    });
  }),
};
