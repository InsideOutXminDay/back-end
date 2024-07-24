const { Model, DataTypes } = require('sequelize');

class EmotionList extends Model {
  static init(sequelize) {
    return super.init({
      id_emotionlist: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      emotionname: { type: DataTypes.STRING, allowNull: false, unique:true },
      emotionimg: { type: DataTypes.STRING, allowNull: false, unique:true },
    }, {
      sequelize,
      tableName: 'emotionlist',
      timestamps: false
    });
  }
}

module.exports = EmotionList;
