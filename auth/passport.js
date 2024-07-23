const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SECRET_KEY = 'your_secret_key';

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

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_ID,
      callbackURL: 'http://localhost:3000/api/kakao/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('카카오로그인');
      console.log('kakao profile: ', profile);
      try {
        const exUser = await User.findOne({
          where: { snsId: profile.id, provider: 'kakao' },
        });
        if (exUser) {
          done(null, exUser);
        } else {
          const newUser = await User.create({
            email: profile._json?.kakao_account?.email,
            nickname: profile.displayName,
            snsId: profile.id,
            provider: 'kakao',
          });
          done(null, newUser);
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id_user);
});

passport.deserializeUser(async (id, done) => {
  //id = user.id_user
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const generateToken = (user) => {
  return jwt.sign(
    { id_user: user.id_user, username: user.username },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
};

module.exports = {
  passport,
  generateToken,
};
