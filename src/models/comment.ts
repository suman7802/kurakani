import {prisma} from './db';

export const commentModel = {
  createComment: async (comment: string, userId: any, postId: number) => {
    try {
      const post = await prisma.comment.create({
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

  createCommentReply: async (
    userId: number,
    postId: number,
    commentId: number,
    comment: string
  ) => {
    try {
      const nestedComment = await prisma.comment.create({
        data: {
          userId: userId,
          postId: postId,
          parentCommentId: commentId,
          comment: comment,
        },
      });
      return nestedComment;
    } catch (error) {
      throw error;
    }
  },

  readComments: async () => {
    try {
      const allComments = await prisma.comment.findMany({
        include: {
          childComments: true,
        },
      });

      const allCommentsExcludingUserId = allComments.map((item) => {
        const {userId, ...rest} = item;
        return rest;
      });
      return allCommentsExcludingUserId;
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
      const updatedComment = await prisma.comment.update({
        where: {
          id: id,
          postId: postId,
          userId: userId,
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
      const deletedComment = await prisma.comment.delete({
        where: {
          id: id,
          postId: postId,
          userId: userId,
        },
      });
      return deletedComment;
    } catch (error) {
      throw error;
    }
  },
};
