require('dotenv').config();
import {PassportStatic} from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {prisma} from '../models/db';

function localAuth(passport: PassportStatic) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
        session: true,
      },
      async function (req, email, otp, done) {
        const [user] = await prisma.users.findMany({
          where: {
            email: email,
            provider: 'manual',
          },
        });

        const currentDate = new Date();

        const OtpNotExpired =
          user.otp_expire &&
          user.otp_expire.getUTCSeconds() - currentDate.getUTCSeconds() > 0;

          // OtpNotExpired && user.otp === otp
        if (1) {
          // @ts-ignore
          return done(null, user);
        } else {
          return done(null, false);
        }
      }
    )
  );
}

export {localAuth};
