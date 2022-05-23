'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pesanans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_customer: {
        references: {
          model: {
            tableName: 'Customers',
            schema: 'public'
          },
          key: 'id'
        },
        onDelete: 'SET NULL', 
        onUpdate: 'CASCADE',
        type: Sequelize.INTEGER
      },
      items: {
        allowNull: false,
        type: Sequelize.JSONB
      },
      metode_pembayaran: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status_pembayaran: {
        type: Sequelize.STRING
      },
      status_pesanan: {
        allowNull: false,
        type: Sequelize.STRING
      },
      catatan: {
        type: Sequelize.TEXT
      },
      metode_pengiriman_pesanan: {
        allowNull: false,
        type: Sequelize.STRING
      },
      total_harga: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      invoice_id: {
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
    await queryInterface.dropTable('Pesanans');
  }
};