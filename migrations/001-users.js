'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      bio: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
        unique: false,
      },
      profilePicture: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
        unique: false,
        defaultValue: ('https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png')
      },
      accessToken: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
        unique: false,
      },
      

    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
