module.exports = function () {
  const passport = require('passport');
  const localStrategy = require('passport-local').Strategy;
  const bcrypt = require('bcrypt');
  const User = require('../models/User');

  // Serialize and Deserialize User
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new localStrategy(async (username, password, done) => {
    try {
      // Get user from the database
      let user = await User.findOne({ username: username });
      // If the user is not found, return false
      if (!user) return done(null, false, { message: 'Incorrect username' });
      // Compare the user password to passed in password
      let result = await bcrypt.compare(password, user.password);
      // If password is incorrect, return false
      if (!result) return done(null, false, { message: 'Incorrect password' });
      // If all is good, return user
      return done(null, user);
    } catch (err) {
      if (err) return done(err);
    }
  }));
}