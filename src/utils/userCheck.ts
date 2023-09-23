import {prisma} from '../models/db';
export async function getUser(email: string) {
  const [user] = await prisma.users
    .findMany({
      where: {
        email: email,
        provider: 'manual',
      },
    })
    .catch((err) => {
      throw err;
    });

  return user;
}
