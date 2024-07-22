const { Model, DataTypes } = require('sequelize');

class Diarylist extends Model {
  static init(sequelize) {
    return super.init({
      id_diarylist: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_diary: { type: DataTypes.INTEGER, allowNull: false },
      id_user: { type: DataTypes.INTEGER, allowNull: false },
    }, {
      sequelize,
      tableName: 'diarylist',
      timestamps: false
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'id_user' });
    this.belongsTo(models.Diary, { foreignKey: 'id_diary' });
  }
}

module.exports = Diarylist;
