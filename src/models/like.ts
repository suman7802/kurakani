import {prisma} from './db';

export const likeModel = {
  createLikes: async (userId: any, postId: number) => {
    try {
      const post = await prisma.like.create({
        data: {
          user: {
            connect: {id: userId},
          },
          post: {
            connect: {id: postId},
          },
        },
      });
      return post;
    } catch (error) {
      throw error;
    }
  },

  readLikes: async () => {
    try {
      const allLikes = await prisma.like.findMany({});

      // const allCommentsExcludingUserId = allLikes.map((item) => {
      //   const {userId, ...rest} = item;
      //   return rest;
      // });
      // return allCommentsExcludingUserId;

      const likeCount = allLikes.length;
      return likeCount;
    } catch (error) {
      throw error;
    }
  },
};
