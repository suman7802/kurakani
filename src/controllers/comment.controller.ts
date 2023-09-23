import {Request, Response} from 'express';
import {commentModel} from '../models/comment';

export const commentController = {
  addComment: async (req: Request, res: Response) => {
    const {comment, postId} = req.body;
    const userId = req.user?.id;

    await commentModel
      .createComment(comment, userId, postId)
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        throw err;
      });
  },

  CreateCommentReply: async (req: Request, res: Response) => {
    const {comment, postId, commentId} = req.body;
    const userId: any = req.user?.id;

    await commentModel
      .createCommentReply(userId, postId, commentId, comment)
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        throw err;
      });
  },

  getComments: async (req: Request, res: Response) => {
    await commentModel
      .readComments()
      .then((response) => {
        return res.send(response);
      })
      .catch((error) => {
        throw error;
      });
  },

  updateComment: async (req: Request, res: Response) => {
    const {id, postId, comment} = req.body;
    const userId = req.user?.id;
    await commentModel
      .updateComment(id, userId, postId, comment)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        throw error;
      });
  },

  deleteComment: async (req: Request, res: Response) => {
    const {id, postId} = req.body;
    const userId = req.user?.id;
    await commentModel
      .deleteComment(id, postId, userId)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        throw error;
      });
  },
};
