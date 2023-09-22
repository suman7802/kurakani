require('dotenv').config();
import otpGenerator from 'otp-generator';

import {prisma} from './db';
import {sendMailForOtp} from '../services/sendOTP';
import {Request, Response} from 'express';

// Generate OTP
function getOTP() {
  return otpGenerator.generate(5, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
}

// Calculate OTP expiration time (3 minutes from now)
function otpTime() {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 3);
  return expirationTime;
}

// Handle OTP creation and user creation/updating
export async function getCreateUser(req: Request, res: Response) {
  const email = req.body.email;
  try {
    const [existingUser] = await prisma.users.findMany({
      where: {
        email: email,
        provider: 'manual',
      },
    });

    const currentDate: any = new Date();
    const isOtpExpired =
      // @ts-ignores
      existingUser && existingUser.otp_expire - currentDate < 0;

    if (existingUser && isOtpExpired) {
      // Regenerate OTP and update expiration time
      const otp = getOTP();
      const otp_expire = otpTime();

      await prisma.users.updateMany({
        where: {
          email: email,
          provider: 'manual',
        },
        data: {
          otp: otp,
          otp_expire: otp_expire,
        },
      });

      const response = await sendMailForOtp(otp, email);
      res.send(response);
    } else {
      if (!existingUser) {
        // If no user exists, create a new user
        const otp = getOTP();
        const otp_expire = otpTime();

        await prisma.users.create({
          data: {
            email: email,
            otp: otp,
            otp_expire: otp_expire,
            provider: 'manual',
          },
        });

        const response = await sendMailForOtp(otp, email);
        res.send(response);
      } else {
        // If user exists, and unexpired otp
        res.send('suer you valid otp to login');
      }
    }
  } catch (error) {
    throw error;
  }
}
