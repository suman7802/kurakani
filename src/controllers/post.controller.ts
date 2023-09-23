import {Request, Response} from 'express';
import {postModel} from '../models/post';

export const postController = {
  addPost: async (req: Request, res: Response) => {
    const {title, blog, privacy} = req.body;
    const userId = req.user?.id;

    const alreadyHaveTitle = await postModel
      .titleAvailability(title)
      .catch((err) => {
        throw err;
      });

    if (alreadyHaveTitle) {
      return res.send('Title is taken');
    }

    await postModel
      .createPost(title, blog, privacy, userId)
      .then((response) => {
        return res.send(response);
      })
      .catch((error) => {
        throw error;
      });
  },

  getAllPublicPost: async (req: Request, res: Response) => {
    await postModel
      .readAllPublicPost()
      .then((response) => {
        return res.send(response);
      })
      .catch((error) => {
        throw error;
      });
  },

  getAllPost: async (req: Request, res: Response) => {
    const userId = req.user?.id;
    await postModel
      .readAllPost(userId)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        throw error;
      });
  },

  getPost: async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const postId = req.body.id;
    await postModel
      .readPost(userId, postId)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        throw error;
      });
  },

  updatePost: async (req: Request, res: Response) => {
    const {id, title, blog, privacy} = req.body;
    const userId = req.user?.id;
    await postModel
      .updatePost(id, userId, title, blog, privacy)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        throw error;
      });
  },

  deletePost: async (req: Request, res: Response) => {
    const postId = req.body.id;
    const userId = req.user?.id;
    await postModel
      .deletePost(postId, userId)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        throw error;
      });
  },
};
