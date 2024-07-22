const { Model, DataTypes } = require('sequelize');

class Diary extends Model {
  static init(sequelize) {
    return super.init({
      id_diary: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_emotion: { type: DataTypes.INTEGER, allowNull: false},
      content: { type: DataTypes.STRING, allowNull: false },
      date: { type: DataTypes.STRING, allowNull: false}
    }, {
      sequelize,
      tableName: 'diary',
      timestamps: false
    });

  }
}

module.exports = Diary;