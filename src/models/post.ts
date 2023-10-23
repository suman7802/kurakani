import {prisma} from './db';
export const postModel = {
  createPost: async (
    title: string,
    content: string,
    privacy: boolean,
    userId: any
  ) => {
    return await prisma.post.create({
      data: {
        user: {
          connect: {id: userId},
        },
        title,
        content,
        privacy,
      },
    });
  },

  readAllPublicPost: async () => {
    return await prisma.post.findMany({
      where: {
        privacy: false,
      },

      select: {
        id: true,
        title: true,
        content: true,
        createdDate: true,
        editedDate: true,

        comments: {
          select: {
            id: true,
            postId: true,
            parentComment: true,
            comment: true,
            createdDate: true,
            editedDate: true,

            childComments: {
              select: {
                id: true,
                postId: true,
                comment: true,
                childComments: true,
                createdDate: true,
                editedDate: true,
              },
            },
          },
        },

        likes: {
          select: {
            id: true,
            postId: true,
          },
        },
      },
    });
  },

  readAllPost: async (userId: any) => {
    return await prisma.post.findMany({
      where: {
        userId: userId,
      },
      include: {
        comments: true,
        likes: true,
      },
    });
  },

  readPost: async (userId: any, postId: number) => {
    return await prisma.post.findUnique({
      where: {
        id: postId,
        userId: userId,
      },
      include: {
        comments: true,
        likes: true,
      },
    });
  },

  updatePost: async (
    id: number,
    userId: any,
    title: string,
    content: string,
    privacy: boolean
  ) => {
    return await prisma.post.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        title: title,
        content: content,
        privacy: privacy,
      },
    });
  },

  deletePost: async (postId: number, userId: any) => {
    return await prisma.post.delete({
      where: {
        id: postId,
        userId: userId,
      },
    });
  },
};
