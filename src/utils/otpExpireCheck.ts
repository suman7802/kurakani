import {prisma} from '../models/db';
export async function otpExpireCheck(email: string) {
  try {
    const [user] = await prisma.user
      .findMany({
        where: {
          email: email,
          provider: 'manual',
        },
      })
      .catch((err) => {
        throw err;
      });

    const currentDate = new Date();

    const NotExpired = user?.otpExpire && user?.otpExpire?.getTime() - currentDate.getTime() > 0;

    return NotExpired;
  } catch (error) {
    throw error;
  }
}
