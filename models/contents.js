const { Model, DataTypes } = require('sequelize');

class Contents extends Model {
  static init(sequelize) {
    return super.init({
      maincontent_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
      content_id:{type: DataTypes.INTEGER, allowNull: false},
      subcontent_id: { type: DataTypes.INTEGER, allowNull: false },
      content_name: { type: DataTypes.STRING, allowNull: false },
      subcontent_name : { type: DataTypes.STRING, allowNull: false },
      content_link : {type: DataTypes.STRING, allowNull: false},
      content_image : {type: DataTypes.STRING, allowNull: false},
      subcontent_image : {type: DataTypes.STRING, allowNull: false},

    }, {
      sequelize,
      tableName: 'contents',
      timestamps: false
    });
  }

}

module.exports = Contents;


