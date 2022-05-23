'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artikel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    //fungsi untuk membuat artikel
    static buatArticle({judulArtikel, isiArtikel, urlGambar}){
     return this.create({ judul_artikel: judulArtikel, isi_artikel: isiArtikel, url_gambar: urlGambar }); 
    }

    //fungsi untuk delete artikel
    static deleteArticle(id){
      return this.destroy({ where: { id: id } })
    }

    //fungsi untuk update artikel
    static updateArtikel({ judulArtikel, isiArtikel, urlGambar },id){
      return this.update({ judul_artikel: judulArtikel, isi_artikel: isiArtikel, url_gambar: urlGambar }, { where:{id: id} })
    }

    //fungsi untuk mengambil data artikel berdasarkan id
    static getArtikelById(id){
      return this.findOne({ where: { id: id } });
    }

  };
  Artikel.init({
    judul_artikel: DataTypes.STRING,
    isi_artikel: DataTypes.TEXT,
    url_gambar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Artikel',
  });
  return Artikel;
};