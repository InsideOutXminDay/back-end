const { Sequelize } = require('sequelize');
const Paragraph = require('./paragraph');
const Askcheck = require('./askcheck');
const Post = require('./post');
const User = require('./user');
const Asklist = require('./asklist');
const Diary = require('./diary');
const Diarylist = require('./diarylist');
const Comment = require('./comment');
const Contents = require('./contents');
const EmotionList = require('./emotionlist');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
let sequelize = new Sequelize(config.database, config.username, config.password, config);


const db = {
  sequelize,
  Paragraph: Paragraph.init(sequelize),
  Askcheck: Askcheck.init(sequelize),
  User: User.init(sequelize),
  Post: Post.init(sequelize),
  Asklist: Asklist.init(sequelize),
  Comment: Comment.init(sequelize),
  Diary: Diary.init(sequelize),
  Diarylist: Diarylist.init(sequelize),
  Contents: Contents.init(sequelize),
  EmotionList: EmotionList.init(sequelize)
};


Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

sequelize.sync();

module.exports = db;
