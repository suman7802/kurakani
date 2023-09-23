require('dotenv').config();
import {PassportStatic} from 'passport';
import facebookStrategy from 'passport-facebook';

const {prisma} = require('../models/db');

function facebookAuth(passport: PassportStatic) {
  passport.use(
    new facebookStrategy.Strategy(
      {
        clientID: process.env.F_CLIENT_ID as string,
        clientSecret: process.env.F_CLIENT_SECRET as string,
        callbackURL: process.env.F_CALLBACK_URL as string,
        graphAPIVersion: 'v17.0',
      },

      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // get user
          const existingUser = await prisma.user.findOne({
            socialId: profile.id,
            provider: profile.provider,
          });
          if (!existingUser) {
            // create user
            const newUser = await prisma.user.createOne({
              socialId: profile.id,
              userName: profile.displayName,
              provider: profile.provider,
            });
            return done(null, newUser);
          }
          return done(null, existingUser);
        } catch (error) {
          return error;
        }
      }
    )
  );
}

export {facebookAuth};
