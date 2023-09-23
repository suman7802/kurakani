import {prisma} from './db';
export const postModel = {
  titleAvailability: async (title: string) => {
    try {
      const [response] = await prisma.posts.findMany({
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
    blog: string,
    privacy: boolean,
    userId: any
  ) => {
    try {
      const post = await prisma.posts.create({
        data: {
          user: {
            connect: {id: userId},
          },
          title,
          blog,
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
      const allPublicPosts = await prisma.posts.findMany({
        where: {
          privacy: false,
        },
        include: {
          comments: true,
          likes: true,
        },
      });

      const allPublicPostsExcludingUserId = allPublicPosts.map((item) => {
        const {user_id, ...rest} = item;
        return rest;
      });

      return allPublicPostsExcludingUserId;
    } catch (error) {
      throw error;
    }
  },

  readAllPost: async (userId: any) => {
    try {
      const allPosts = await prisma.posts.findMany({
        where: {
          user_id: userId,
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
      const allMyPosts = await prisma.posts.findUnique({
        where: {
          id: postId,
          user_id: userId,
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
    blog: string,
    privacy: boolean
  ) => {
    try {
      const allMyPosts = await prisma.posts.update({
        where: {
          id: id,
          user_id: userId,
        },
        data: {
          title: title,
          blog: blog,
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
      const deletedPost = await prisma.posts.delete({
        where: {
          id: postId,
          user_id: userId,
        },
      });
      return deletedPost;
    } catch (error) {
      throw error;
    }
  },
};
