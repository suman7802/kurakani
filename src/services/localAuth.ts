require('dotenv').config();
import {PassportStatic} from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import otpGenerator from 'otp-generator';
import {sendMailForOtp} from './sendOTP';

import {prisma} from '../models/db';

function localAuth(passport: PassportStatic) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'email',
        passReqToCallback: true,
        session: true,
      },
      async function (req, email, password, done) {
        try {
          // otp generated
          const otp = otpGenerator.generate(5, {
            upperCaseAlphabets: false,
            specialChars: false,
          });

          // expire date of otp
          const expirationTime = new Date();
          expirationTime.setMinutes(expirationTime.getMinutes() + 3);

          let user = await prisma.users.findMany({
            where: {
              email: email,
              provider: 'manual',
            },
          });

          if (user.length > 0) {
            const otp_expire: any = user[0].otp_expire;
            const currentDate: any = new Date();

            // if otp is expired
            if (otp_expire - currentDate < 0) {
              console.log(`generating and updating otp`);
              await prisma.users.updateMany({
                where: {
                  email: email,
                  provider: 'manual',
                },
                data: {
                  otp: otp,
                  otp_expire: expirationTime,
                },
              });
              await sendMailForOtp(otp, email);
            }
          }

          if (user.length === 0) {
            await sendMailForOtp(otp, email);
            // @ts-ignore
            user = await prisma.users.create({
              data: {
                email: email,
                otp: otp,
                otp_expire: expirationTime,
                provider: 'manual',
              },
            });
          }

          // @ts-ignore
          return done(null, user);
        } catch (error) {
          throw error;
        }
      }
    )
  );
}

export {localAuth};
