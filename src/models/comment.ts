import {prisma} from './db';

export const commentModel = {
  createComment: async (comment: string, userId: any, postId: number) => {
    try {
      const post = await prisma.comments.create({
        data: {
          user: {
            connect: {id: userId},
          },
          post: {
            connect: {id: postId},
          },
          comment,
        },
      });
      return post;
    } catch (error) {
      throw error;
    }
  },

  readComments: async () => {
    try {
      const allComments = await prisma.comments.findMany({});
      return allComments;
    } catch (error) {
      throw error;
    }
  },

  updateComment: async (
    id: number,
    userId: any,
    postId: number,
    comment: string
  ) => {
    try {
      const updatedComment = await prisma.comments.update({
        where: {
          id: id,
          post_id: postId,
          user_id: userId,
        },
        data: {
          comment: comment,
        },
      });
      return updatedComment;
    } catch (error) {
      throw error;
    }
  },

  deleteComment: async (id: number, postId: number, userId: any) => {
    try {
      const deletedComment = await prisma.comments.delete({
        where: {
          id: id,
          post_id: postId,
          user_id: userId,
        },
      });
      return deletedComment;
    } catch (error) {
      throw error;
    }
  },
};
