require('dotenv').config();
import otpGenerator from 'otp-generator';

import {prisma} from './db';
import {sendMailForOtp} from '../utils/sendOTP';
import {getUser} from '../utils/userCheck';
import {otpExpireCheck} from '../utils/otpExpireCheck';

// Generate OTP
function getOTP(): string {
  return otpGenerator.generate(5, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
}

// Calculate OTP expiration time (3 minutes)
function otpTime(): Date {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 3);
  return expirationTime;
}

// Handle OTP creation and user creation/updating
export async function getCreateUser(email: string) {
  const OtpNotExpired = await otpExpireCheck(email);
  const user = await getUser(email);

  if (user && !OtpNotExpired) {
    // Regenerate OTP and update expiration time
    const otp = getOTP();
    const otpExpire = otpTime();

    await prisma.users.updateMany({
      where: {
        email: email,
        provider: 'manual',
      },
      data: {
        otp: otp,
        otpExpire: otpExpire,
      },
    });

    return await sendMailForOtp(otp, email);
  } else {
    // If no user exists, create a new user
    if (!user) {
      const otp = getOTP();
      const otpExpire = otpTime();

      await prisma.users.create({
        data: {
          email: email,
          otp: otp,
          otpExpire: otpExpire,
          provider: 'manual',
        },
      });

      return await sendMailForOtp(otp, email);
    } else {
      // If user exists, and unexpired otp
      return 'use your valid otp to login';
    }
  }
}
