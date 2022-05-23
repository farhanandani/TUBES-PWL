'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Layanan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Kategori_layanan, 
                     {foreignKey: { name: 'nama_kategori' ,allowNull: false }, 
                      onDelete: 'CASCADE', 
                      onUpdate: 'CASCADE',
                      hooks: true,
                     }
      );
    }

    static tambahLayanan( {namaLayanan, namaKategori, deskripsi, harga, urlGambar} ){
      return this.create({ nama_layanan: namaLayanan, nama_kategori: namaKategori, deskripsi: deskripsi, harga: harga, url_gambar: urlGambar });
    }

    static deleteLayanan(idLayanan){
      return this.destroy({ where: { id: idLayanan } });
    }

    static updateLayanan({ namaLayanan, namaKategori, deskripsi, harga, urlGambar },idLayanan){
      return this.update({ nama_layanan: namaLayanan, nama_kategori: namaKategori, deskripsi: deskripsi, harga: harga, url_gambar: urlGambar }, { where:{nama_layanan: idLayanan} })
    }

    static getLayanan(idLayanan){
      return this.findOne({ where: { nama_layanan: idLayanan } });
    }

  };
  Layanan.init({
    nama_layanan: DataTypes.STRING,
    nama_kategori: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    harga: DataTypes.DECIMAL,
    url_gambar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Layanan',
  });
  return Layanan;
};