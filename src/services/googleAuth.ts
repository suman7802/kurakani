require('dotenv').config();
import {PassportStatic} from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';

const {prisma} = require('../models/db');

function googleAuth(passport: PassportStatic) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.G_CLIENT_ID as string,
        clientSecret: process.env.G_CLIENT_SECRET as string,
        callbackURL: process.env.G_CALLBACK_URL as string,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // get user
          const existingUser = await prisma.Users.findOne({
            social_id: profile.id,
            provider: profile.provider,
          });

          // create user
          if (!existingUser) {
            const newUser = await prisma.User.create({
              social_id: profile.id,
              user_name: profile.displayName,
              email: profile._json.email,
              provider: profile.provider,
            });
            return done(null, newUser);
          }
          return done(null, existingUser);
        } catch (error) {
          throw error;
        }
      }
    )
  );
}
export {googleAuth};
