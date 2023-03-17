const { DataTypes } = require('sequelize');
const { Model } = require('sequelize');
const sequelize = require('../../config/database.config');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      bio: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        unique: false,
      },
      profilePicture: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        unique: false,
        defaultValue: ('https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png')
      },
      accessToken: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        unique: false,
      },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
});

module.exports = User;