require('dotenv').config();
import {PassportStatic} from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import otpGenerator from 'otp-generator';
import {sendMailForOtp} from './sendOTP';

const {prisma} = require('../models/db');

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
          const otp = otpGenerator.generate(5, {
            upperCaseAlphabets: false,
            specialChars: false,
          });

          await sendMailForOtp(otp, email);

          let user = await prisma.User.findOne({
            data: {
              email: email,
            },
          });

          if (!user) {
            user = await prisma.User.createOne({
              email: email,
              provider: 'manual',
            });
          }

          const expirationTime = new Date();
          expirationTime.setMinutes(expirationTime.getMinutes() + 3);

          req.session.otp = otp;
          req.session.otp_expire = expirationTime;

          return done(null, user);
        } catch (error) {
          throw error;
        }
      }
    )
  );
}

export {localAuth};
