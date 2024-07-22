// const { Model, DataTypes } = require('sequelize');

// class Post extends Model {
//   static init(sequelize) {
//     return super.init({
//       id_post: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//       title: { type: DataTypes.STRING, allowNull: false },
//       body: { type: DataTypes.STRING, allowNull: false },
//       anonymity: { type: DataTypes.TINYINT, allowNull: false }
//     }, {
//       sequelize,
//       tableName: 'post',
//       timestamps: false
//     });
//   }

// }

// module.exports = Post;

const { Model, DataTypes } = require('sequelize');

class Post extends Model {
  static init(sequelize) {
    return super.init({
      id_post: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_user: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      body: { type: DataTypes.STRING, allowNull: false },
      anonymity: { type: DataTypes.TINYINT, allowNull: false }
    }, {
      sequelize,
      tableName: 'post',
      timestamps: false
    });
  }
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'id_user' });
  }

}

module.exports = Post;
