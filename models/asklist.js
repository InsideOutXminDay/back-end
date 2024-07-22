const { Model, DataTypes } = require('sequelize');

class Asklist extends Model {
  static init(sequelize) {
    return super.init({
      id_asklist: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_askcheck: { type: DataTypes.INTEGER, allowNull: false },
      id_user: { type: DataTypes.INTEGER, allowNull: false },
    }, {
      sequelize,
      tableName: 'asklist',
      timestamps: false
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'id_user' });
    this.belongsTo(models.Askcheck, { foreignKey: 'id_askcheck' });
  }
}

module.exports = Asklist;
