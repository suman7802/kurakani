import {prisma} from './db';
export const postModel = {
  titleAvailability: async (title: string) => {
    try {
      const [response] = await prisma.post.findMany({
        where: {
          title: title,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  createPost: async (
    title: string,
    content: string,
    privacy: boolean,
    userId: any
  ) => {
    try {
      const post = await prisma.post.create({
        data: {
          user: {
            connect: {id: userId},
          },
          title,
          content,
          privacy,
        },
      });
      return post;
    } catch (error) {
      throw error;
    }
  },

  readAllPublicPost: async () => {
    try {
      const allPublicPosts = await prisma.post.findMany({
        where: {
          privacy: false,
        },
        include: {
          comments: true,
          likes: true,
        },
      });

      const allPublicPostsExcludingUserId = allPublicPosts.map((item) => {
        const {userId, ...rest} = item;
        return rest;
      });

      return allPublicPostsExcludingUserId;
    } catch (error) {
      throw error;
    }
  },

  readAllPost: async (userId: any) => {
    try {
      const allPosts = await prisma.post.findMany({
        where: {
          userId: userId,
        },
        include: {
          comments: true,
          likes: true,
        },
      });
      return allPosts;
    } catch (error) {
      throw error;
    }
  },

  readPost: async (userId: any, postId: number) => {
    try {
      const allMyPosts = await prisma.post.findUnique({
        where: {
          id: postId,
          userId: userId,
        },
        include: {
          comments: true,
          likes: true,
        },
      });
      return allMyPosts;
    } catch (error) {
      throw error;
    }
  },

  updatePost: async (
    id: number,
    userId: any,
    title: string,
    content: string,
    privacy: boolean
  ) => {
    try {
      const allMyPosts = await prisma.post.update({
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
      return allMyPosts;
    } catch (error) {
      throw error;
    }
  },

  deletePost: async (postId: number, userId: any) => {
    try {
      const deletedPost = await prisma.post.delete({
        where: {
          id: postId,
          userId: userId,
        },
      });
      return deletedPost;
    } catch (error) {
      throw error;
    }
  },
};
