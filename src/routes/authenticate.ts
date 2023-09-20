import {PassportStatic} from 'passport';
import {Application} from 'express';
import {VerifyCallback} from 'passport-google-oauth20';

import {googleAuth} from '../services/googleAuth';
import {facebookAuth} from '../services/facebookAuth';

function authenticate(app: Application, passport: PassportStatic) {
  //google strategy
  googleAuth(passport);

  //facebook strategy
  facebookAuth(passport);

  passport.serializeUser((user: Express.User, done: VerifyCallback) => {
    done(null, user);
  });

  passport.deserializeUser((user: Express.User, done: VerifyCallback) => {
    done(null, user);
  });

  // google login
  app.get(
    '/api/user/google',
    passport.authenticate('google', {scope: ['profile', 'email']})
  );

  // google redirect
  app.get(
    '/oauth2/redirect/google',
    passport.authenticate('google', {
      failureRedirect: '/',
      successRedirect: '/dashboard',
    })
  );

  //facebook login
  app.get('/api/user/facebook', passport.authenticate('facebook', {}));

  //facebook redirect
  app.get(
    '/oauth2/redirect/facebook',
    passport.authenticate('facebook', {
      failureRedirect: '/',
      successRedirect: '/dashboard',
    })
  );
}

export {authenticate};
