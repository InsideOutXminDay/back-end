const { Model, DataTypes } = require('sequelize');

class Askcheck extends Model {
  static init(sequelize) {
    return super.init({
      id_askcheck: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      content: { type: DataTypes.STRING, allowNull: false},
      isdone: { type: DataTypes.TINYINT, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false}
    }, {
      sequelize,
      tableName: 'askcheck',
      timestamps: false
    });

  }
}

module.exports = Askcheck;