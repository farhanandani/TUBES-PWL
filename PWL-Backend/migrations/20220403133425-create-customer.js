'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_customer: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      email_customer: {
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
        type: Sequelize.STRING
      },
      no_telepon: {
        allowNull: false,
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.TEXT
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM("pending", "active"),
        defaultValue: "pending",
      },
      confirmationCode:{
        unique: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Customers');
  }
};