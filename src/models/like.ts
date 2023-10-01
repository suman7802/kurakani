import {prisma} from './db';

export const likeModel = {
  createLikes: async (userId: any, postId: number) => {
    return await prisma.like.create({
      data: {
        user: {
          connect: {id: userId},
        },
        post: {
          connect: {id: postId},
        },
      },
    });
  },

  readLikes: async () => {
    const allLikes = await prisma.like.findMany({});
    return allLikes.length;
  },
};
