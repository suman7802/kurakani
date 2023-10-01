import {Request, Response} from 'express';
import {postModel} from '../models/post';
import catchAsync from '../utils/catchAsync';

export const postController = {
  addPost: catchAsync(async (req: Request, res: Response) => {
    const {title, blog, privacy} = req.body;
    const userId = req.user?.id;
    const alreadyHaveTitle = await postModel.titleAvailability(title);

    if (!alreadyHaveTitle) {
      await postModel
        .createPost(title, blog, privacy, userId)
        .then((response) => {
          return res.send(response);
        })
        .catch((err) => {
          throw err;
        });
    }
  }),

  getAllPublicPost: catchAsync(async (req: Request, res: Response) => {
    await postModel
      .readAllPublicPost()
      .then((response) => {
        return res.send(response);
      })
      .catch((err) => {
        throw err;
      });
  }),

  getAllPost: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    await postModel
      .readAllPost(userId)
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        throw err;
      });
  }),

  getPost: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const postId = req.body.id;
    await postModel
      .readPost(userId, postId)
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        throw err;
      });
  }),

  updatePost: catchAsync(async (req: Request, res: Response) => {
    const {id, title, blog, privacy} = req.body;
    const userId = req.user?.id;
    await postModel
      .updatePost(id, userId, title, blog, privacy)
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        throw err;
      });
  }),

  deletePost: catchAsync(async (req: Request, res: Response) => {
    const postId = req.body.id;
    const userId = req.user?.id;
    await postModel
      .deletePost(postId, userId)
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        throw err;
      });
  }),
};
