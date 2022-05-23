'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Layanans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_layanan: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nama_kategori: {
        allowNull: false,
        references: {
          model: {
            tableName: 'Kategori_layanans',
            schema: 'public'
          },
          key: 'nama_kategori'
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE',
        type: Sequelize.STRING
      },
      deskripsi: {
        type: Sequelize.TEXT
      },
      harga: {
        allowNull: false,
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('Layanans');
  }
};