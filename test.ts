import {PassportStatic} from 'passport';
import localStrategy from 'passport-local';
import {createUser, getUserByUniqueIdentifier} from '../../users/user.services';
import {LoginType} from '../../utils/enums';
import {createOtp, getOtpById} from '../otp/otp.services';
import {Request} from 'express';
import {User} from '../../types/user.types';

// eslint-disable-next-line no-unused-vars
type Idone = (
  error: Error | null,
  user?: false | Express.User | undefined
) => void;
type ReqWithUser = Request & Required<{user: User}>;

const handleExistingUserWithSession = async (req: ReqWithUser, done: Idone) => {
  if (req.user?.isSessionVerified) {
    return done(null, req.user);
  }

  const {otpId} = req.user;
  if (otpId) {
    const otp = await getOtpById(otpId);
    if (otp.is_verified) {
      req.user.isSessionVerified = true;

      return done(null, req.user);
    }
  }
  const otp = await createOtp(req.user.email as string);

  return done(null, {...req.user, otpId: otp.id});
};

const handleExistingUserWithoutSession = async (user: User, done: Idone) => {
  const otp = await createOtp(user.email as string);

  return done(null, {...user, otpId: otp.id});
};

const handleNewUser = async (email: string, done: Idone) => {
  const newUser = await createUser({
    unique_identifier: email,
    login_type: LoginType.email,
    email: email,
  });
  const otp = await createOtp(email);

  return done(null, {...newUser, otpId: otp.id});
};

export const emailStrategyInit = (passport: PassportStatic) => {
  passport.use(
    LoginType.email,
    new localStrategy.Strategy(
      {
        usernameField: 'email', //  field to use as the username (email)
        passwordField: 'email', // no password
        passReqToCallback: true,
      },
      async (req, email, _password, done) => {
        try {
          const existingUser = await getUserByUniqueIdentifier(
            email,
            LoginType.email
          ).catch(() => null);

          if (existingUser) {
            if (req.user && req.user.unique_identifier === email) {
              return handleExistingUserWithSession(req as ReqWithUser, done);
            } else {
              return handleExistingUserWithoutSession(existingUser, done);
            }
          } else {
            return handleNewUser(email, done);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
