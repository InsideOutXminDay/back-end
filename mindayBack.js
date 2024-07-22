const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
// const jwt = require('jsonwebtoken');
const { sequelize, Paragraph, Askcheck, User, Post, Asklist, Diarylist, Diary } = require('./models');
const { passport } = require('./auth/passport');

const app = express();
const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(express.json());
app.use(session({ secret: SECRET_KEY, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//////////////////////////// paragraph feat ////////////////////////////////
app.get('/paragraphs', async (req, res) => {
    try {
      const paragraphs = await Paragraph.findAll();
      res.json(paragraphs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  });
//////////////////////////// checklist feat ////////////////////////////////
app.get('/askchecks', async (req, res) => {
    try {
      const askchecks = await Asklist.findAll({
        include: [User, Askcheck]
      });
      res.json(askchecks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch asklists' });
    }
});

app.post('/updatechecklist', async (req, res) => {
    const {id_user, content, isdone, type, id_askcheck } = req.body;
    console.log("updatechecklist", id_askcheck, id_user, content, isdone, type);
    try {
      const AskLists = await Asklist.findAll({ where: { id_user: id_user } });
      if (AskLists.length > 0) {
          const AskCheckId = AskLists.map(record => record.id_askcheck);
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

app.post('/createchecklist', async (req, res) => {
  const {user_id, state} = req.body;
    Object.keys(state).forEach(async(key) => {
      console.log(key);
      console.log(state[key].content);
      console.log(user_id)
      try{
        const newAskcheck = await Askcheck.create({content:state[key].content, isdone:0, type:key});
        console.log("newAskcheck.id_askcheck",newAskcheck.id_askcheck)
        await Asklist.create({
          id_askcheck: newAskcheck.id_askcheck,
          id_user:user_id
        });
        console.log('Create success!');
      }catch(err){
        console.error(err);
      }
    })
  
 
});

//////////////////////////// diary feat ////////////////////////////////
app.get('/diarys', async (req, res) => {
  try {
    const diarys = await Diarylist.findAll({
      include: [User, Diary]
    });
    res.json(diarys);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch diarylists' });
  }
});

app.post('/updatediary', async (req, res) => {
  const {id_diary, date, id_emotion, id_user, content } = req.body.data;
  console.log(req.body)
  console.log("updatediary", id_user, content, date, id_emotion, id_diary);
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

app.post('/creatediary', async (req, res) => {
  const {date, id_emotion, content, id_user} = req.body.data;
  console.log(req.body)
      try{
        const newDiary = await Diary.create({content, date, id_emotion});
        console.log("newDiary.id_askcheck",newDiary.id_diary)
        await Diarylist.create({
          id_diary: newDiary.id_diary,
          id_user
        });
        console.log('Create success!');
      }catch(err){
        console.error(err);
      }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });