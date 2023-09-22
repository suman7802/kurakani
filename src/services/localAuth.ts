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

        const currentDate: any = new Date();
        // @ts-ignores
        const OtpNotExpired = user.otp_expire - currentDate > 0;

        if (OtpNotExpired && user.otp === otp) {
          // @ts-ignore
          return done(null, user);
        } else {
          // some work here
          return done(null, false);
        }
      }
    )
  );
}

export {localAuth};
