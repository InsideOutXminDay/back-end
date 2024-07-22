const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SECRET_KEY = 'your_secret_key';

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use(new KakaoStrategy({
    clientID: '9836c5307b64e9e7190f35c45010ebd6',//process.env.KAKAO_ID,//'your_kakao_client_id', // Add your Kakao Client ID
    //clientSecret: 'your_kakao_client_secret', // Add your Kakao Client Secret
    callbackURL: 'http://localhost:3000/auth/kakao/callback'//'/auth/kakao/callback'//'http://localhost:3000/auth/kakao/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ where: { username: profile.id } });
      if (!user) {
        user = await User.create({ username: profile.id, password: '' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.userid);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const generateToken = (user) => {
  return jwt.sign({ userid: user.userid, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
};

module.exports = {
  passport,
  generateToken
};
