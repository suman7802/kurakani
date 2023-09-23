require('dotenv').config();
import {PassportStatic} from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {otpExpireCheck} from '../utils/otpExpireCheck';
import {getUser} from '../utils/userCheck';

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
        try {
          const OtpNotExpired = await otpExpireCheck(email);
          const user = await getUser(email);

          if (OtpNotExpired && user.otp === otp) {
            // @ts-ignore
            return done(null, user);
          }
          return done(null, false);
        } catch (error) {
          throw error;
        }
      }
    )
  );
}

export {localAuth};
