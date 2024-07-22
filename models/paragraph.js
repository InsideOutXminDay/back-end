const { Model, DataTypes } = require('sequelize');

class Paragraph extends Model {
  static init(sequelize) {
    return super.init({
      id_paragraph: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      article: { type: DataTypes.STRING, allowNull: false, unique:true },
      ver_ko: { type: DataTypes.STRING, allowNull: false, unique:true },
      writer: { type: DataTypes.STRING, allowNull: false }
    }, {
      sequelize,
      tableName: 'paragraph',
      timestamps: false
    });
  }
}

module.exports = Paragraph;
