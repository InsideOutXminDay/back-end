const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        id_user: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        username: { type: DataTypes.STRING, allowNull: false, unique: true },
        nickname: { type: DataTypes.STRING, allowNull: false, unique: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        // provider: {
        //   type: DataTypes.ENUM('local', 'kakao'),
        //   allowNull: false,
        //   defaultValue: 'local',
        // },
        // snsId: { type: DataTypes.STRING, allowNull: true },
      },
      {
        sequelize,
        tableName: 'user',
        timestamps: false,
      }
    );
  }
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
}

module.exports = User;
