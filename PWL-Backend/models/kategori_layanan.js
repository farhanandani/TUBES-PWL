'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kategori_layanan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Layanan,{ foreignKey: { name: 'nama_kategori', allowNull: false }, 
                       onDelete: 'CASCADE', 
                       onUpdate: 'CASCADE',
                       hooks: true,
                     }
      );
    }

    static tambahKategori( {namaKategori, deskripsi, urlGambar} ){
      return this.create({ nama_kategori: namaKategori, deskripsi: deskripsi, url_gambar: urlGambar });
    }

    static deleteKategori(idKategori){
      return this.destroy({ where: { nama_kategori: idKategori } });
    }

    static updateKategori({ namaKategori, deskripsi, urlGambar },idKategori){
      return this.update({ nama_kategori: namaKategori, deskripsi: deskripsi, url_gambar: urlGambar }, { where:{nama_kategori: idKategori} })
    }

    static getKategori(idKategori){
      return this.findOne({ where: { nama_kategori: idKategori } });
    }

  };
  Kategori_layanan.init({
    nama_kategori: {type: DataTypes.STRING, primaryKey: true,},
    deskripsi: DataTypes.TEXT,
    url_gambar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Kategori_layanan',
  });
  return Kategori_layanan;
};