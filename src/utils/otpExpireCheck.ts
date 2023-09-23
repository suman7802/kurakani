import {prisma} from '../models/db';
export async function otpExpireCheck(email: string) {
  try {
    const currentDate = new Date();

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

    if (user.otp_expire) {
      const NotExpired =
        user.otp_expire?.getUTCSeconds() - currentDate.getUTCSeconds() > 0;
      return NotExpired;
    }
  } catch (error) {
    throw error;
  }
}
