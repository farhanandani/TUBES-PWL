'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Kategori_layanans', {
      nama_kategori: {
        primaryKey: true,
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      deskripsi: {
        type: Sequelize.TEXT
      },
      url_gambar: {
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
    await queryInterface.dropTable('Kategori_layanans');
  }
};