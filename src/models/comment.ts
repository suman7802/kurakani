import {prisma} from './db';

export const commentModel = {
  createComment: async (comment: string, userId: any, postId: number) => {
    return await prisma.comment.create({
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
  },

  createCommentReply: async (
    userId: number,
    postId: number,
    commentId: number,
    comment: string
  ) => {
    return await prisma.comment.create({
      data: {
        userId: userId,
        postId: postId,
        parentCommentId: commentId,
        comment: comment,
      },
    });
  },

  readComments: async () => {
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
  },

  updateComment: async (
    id: number,
    userId: any,
    postId: number,
    comment: string
  ) => {
    return await prisma.comment.update({
      where: {
        id: id,
        postId: postId,
        userId: userId,
      },
      data: {
        comment: comment,
      },
    });
  },

  deleteComment: async (id: number, postId: number, userId: any) => {
    return await prisma.comment.delete({
      where: {
        id: id,
        postId: postId,
        userId: userId,
      },
    });
  },
};
