const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { User } = require('../models');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log('로컬 전략으로 넘어옴');
    try {
      const user = await User.findOne({ where: { username } });
      console.log('user:', user);
      if (!user) {
        return done(null, false, { message: '존재하지 않는 아이디입니다.' });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: '비밀번호를 확인해주세요.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

const generateToken = (user) => {
  return jwt.sign(
    { id_user: user.id_user, username: user.username },
    process.env.SECRET_KEY,
    { expiresIn: '3h' }
  );
};

module.exports = {
  passport,
  generateToken,
};
