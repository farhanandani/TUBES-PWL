const { Kategori_layanan, Layanan } = require('../../../models');

module.exports = {

  getAllKategori: (req, res) => {
  	Kategori_layanan.findAll()
      .then((kategoriLayanans) => res.json(kategoriLayanans))
      .catch((err) => res.json(err));
  },

  getKategori: (req, res) => {
  	Kategori_layanan.getKategori(req.params.idKategori)
      .then((kategoriLayanan) => res.json(kategoriLayanan))
      .catch((err) => res.json(err));
  },

  getAllLayanan: (req, res) => {
  	Layanan.findAll()
      .then((layanans) => res.json(layanans))
      .catch((err) => res.json(err));
  },

  getLayanan: (req, res) => {
  	Layanan.getLayanan(req.params.idLayanan)
      .then((layanan) => res.json(layanan))
      .catch((err) => res.json(err));
  },

};