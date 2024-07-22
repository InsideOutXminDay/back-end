const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const {
  sequelize,
  Paragraph,
  Askcheck,
  User,
  Post,
  Asklist,
  Diarylist,
  Diary,
} = require('./models');
const { passport, generateToken } = require('./auth/passport');

const app = express();
//const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//토큰 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

//회원가입
app.post('/api/join', async (req, res) => {
  const { username, nickname, email, password } = req.body;
  console.log('회원가입 요청 받음', req.body);
  console.log('post 요청');
  try {
    const hashedPassword = await User.hashPassword(password);
    console.log('비밀번호 해싱됨');
    const user = await User.create({
      username,
      nickname,
      email,
      password: hashedPassword,
    });
    console.log('사용자 정보 저장 완료');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: '회원가입 실패' });
  }
});
//아이디 중복 확인
app.post('/api/join/check', async (req, res) => {
  const { username } = req.body;
  console.log('아이디 중복 확인 요청 받음', username);
  try {
    //db에서 조회
    const check = await User.findOne({ where: { username } });
    if (check) {
      //중복됨
      res.status(200).json({ exist: true });
    } else {
      res.status(200).json({ exist: false });
    }
  } catch (error) {
    res.status(500).json({ error: '아이디 중복 확인이 안 됨' });
  }
});

//로그인
app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json(info.message);

    const token = generateToken(user);
    res.json({ token });
  })(req, res, next);
});

//카카오 로그인
app.get('/api/kakao', passport.authenticate('kakao'));
app.get('/api/kakao/callback', (req, res, next) => {
  passport.authenticate('kakao', { session: false }, (err, user, info) => {
    console.log('카카오 로그인 페이지에서 로그인 완료');
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/');
    }

    const token = generateToken(req.user);
    //클라이언트에게 토큰 전달
    res.redirect(`http://localhost:3000/home?token=${token}`);

    //카카오 로그인 성공 시
    //res.redirect('http://localhost:3000/home');
  })(req, res, next);
});

//로그아웃
app.post('/api/logout', (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Logged out successfully' });
});

//protected routes
//////////////////////////// paragraph feat ////////////////////////////////
app.get('/paragraphs', authenticateToken, async (req, res) => {
  try {
    const paragraphs = await Paragraph.findAll();
    res.json(paragraphs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});
//////////////////////////// checklist feat ////////////////////////////////
app.get('/askchecks', authenticateToken, async (req, res) => {
  try {
    const askchecks = await Asklist.findAll({
      include: [User, Askcheck],
    });
    res.json(askchecks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch asklists' });
  }
});

app.post('/updatechecklist', authenticateToken, async (req, res) => {
  const { id_user, content, isdone, type, id_askcheck } = req.body;
  console.log('updatechecklist', id_askcheck, id_user, content, isdone, type);
  try {
    const AskLists = await Asklist.findAll({ where: { id_user: id_user } });
    if (AskLists.length > 0) {
      const AskCheckId = AskLists.map((record) => record.id_askcheck);
      await Askcheck.update(
        { content, isdone },
        { where: { type, id_askcheck: AskCheckId } }
      );
      console.log('Update successful');
    } else {
      console.log('No matching AskList records found');
    }
  } catch (error) {
    console.error('Error updating AskCheck:', error);
  }
});

app.post('/createchecklist', authenticateToken, async (req, res) => {
  const { user_id, state } = req.body;
  Object.keys(state).forEach(async (key) => {
    console.log(key);
    console.log(state[key].content);
    console.log(user_id);
    try {
      const newAskcheck = await Askcheck.create({
        content: state[key].content,
        isdone: 0,
        type: key,
      });
      console.log('newAskcheck.id_askcheck', newAskcheck.id_askcheck);
      await Asklist.create({
        id_askcheck: newAskcheck.id_askcheck,
        id_user: user_id,
      });
      console.log('Create success!');
    } catch (err) {
      console.error(err);
    }
  });
});

//////////////////////////// diary feat ////////////////////////////////
app.get('/diarys', authenticateToken, async (req, res) => {
  try {
    const diarys = await Diarylist.findAll({
      include: [User, Diary],
    });
    res.json(diarys);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch diarylists' });
  }
});

app.post('/updatediary', authenticateToken, async (req, res) => {
  const { id_diary, date, id_emotion, id_user, content } = req.body.data;
  console.log(req.body);
  console.log('updatediary', id_user, content, date, id_emotion, id_diary);
  try {
    const Diarylists = await Diarylist.findAll({ where: { id_user: id_user } });
    if (Diarylists.length > 0) {
      await Diary.update(
        { content, date, id_emotion },
        { where: { id_diary: id_diary } }
      );
      console.log('Update successful');
    } else {
      console.log('No matching AskList records found');
    }
  } catch (error) {
    console.error('Error updating AskCheck:', error);
  }
});

app.post('/creatediary', authenticateToken, async (req, res) => {
  const { date, id_emotion, content, id_user } = req.body.data;
  console.log(req.body);
  try {
    const newDiary = await Diary.create({ content, date, id_emotion });
    console.log('newDiary.id_askcheck', newDiary.id_diary);
    await Diarylist.create({
      id_diary: newDiary.id_diary,
      id_user,
    });
    console.log('Create success!');
  } catch (err) {
    console.error(err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  sequelize.sync();
});
