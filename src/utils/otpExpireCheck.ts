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

    const currentDate: any = new Date();
    const otpExpireDate: any = user?.otpExpire;
    const NotExpired = otpExpireDate - currentDate > 0;

    return NotExpired;
  } catch (error) {
    throw error;
  }
}
