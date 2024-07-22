const { Model, DataTypes } = require('sequelize');

class Comment extends Model {
  static init(sequelize) {
    return super.init({
        id_comment: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        body: { type: DataTypes.STRING, allowNull: false },
        id_user: { type: DataTypes.INTEGER, allowNull: false },
        id_post: { type: DataTypes.INTEGER, allowNull: false }   
    }, {
      sequelize,
      tableName: 'comment',
      timestamps: false
    });
  }
  static associate(models) {
    this.belongsTo(models.Post, { foreignKey: 'id_post' });
    this.belongsTo(models.User, { foreignKey: 'id_user' });
  }

}

module.exports = Comment;
