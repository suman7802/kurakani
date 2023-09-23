require('dotenv').config();
import otpGenerator from 'otp-generator';

import {prisma} from './db';
import {sendMailForOtp} from '../services/sendOTP';
import {Request, Response} from 'express';
import {getUser} from '../utils/userCheck';
import {otpExpireCheck} from '../utils/otpExpireCheck';

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

  const OtpNotExpired = await otpExpireCheck(email);
  const user = await getUser(email);

  if (user && !OtpNotExpired) {
    // Regenerate OTP and update expiration time
    const otp = getOTP();
    const otp_expire = otpTime();

    await prisma.users
      .updateMany({
        where: {
          email: email,
          provider: 'manual',
        },
        data: {
          otp: otp,
          otp_expire: otp_expire,
        },
      })
      .catch((err) => {
        throw err;
      });

    const response = await sendMailForOtp(otp, email).catch((err) => {
      throw err;
    });

    return res.send(response);
  } else {
    // If no user exists, create a new user
    if (!user) {
      const otp = getOTP();
      const otp_expire = otpTime();

      await prisma.users
        .create({
          data: {
            email: email,
            otp: otp,
            otp_expire: otp_expire,
            provider: 'manual',
          },
        })
        .catch((err) => {
          throw err;
        });

      const response = await sendMailForOtp(otp, email);
      return res.send(response);
    } else {
      // If user exists, and unexpired otp
      res.send('use your valid otp to login');
    }
  }
}
