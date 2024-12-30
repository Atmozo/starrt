const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { findUserByUsername, findUserById } = require('../models/userModel');

// Configure local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = findUserByUsername(username);
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, user);
  })
);

// Serialize user to session
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize user from session
passport.deserializeUser((id, done) => {
  const user = findUserById(id);
  done(null, user);
});

module.exports = passport;
