const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    return super.init({
      id_user: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      inputid: { type: DataTypes.STRING, allowNull: false, unique:true },
      nickname: { type: DataTypes.STRING, allowNull: false, unique:true },
      email: { type: DataTypes.STRING, allowNull: false, unique:true },
      password: { type: DataTypes.STRING, allowNull: false },
    }, {
      sequelize,
      tableName: 'user',
      timestamps: false
    });
  }
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
}
 
module.exports = User;
