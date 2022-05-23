const { Kategori_layanan, Layanan } = require('../../../models');

module.exports = {

  getAllKategori: (req, res) => {
  	Kategori_layanan.findAll()
      .then((kategoriLayanans) => res.json(kategoriLayanans))
      .catch((err) => res.json(err));
  },

  tambahKategori: (req, res) => {
  	Kategori_layanan.tambahKategori(req.body)
      .then((kategoriLayanan) =>
        res.json({ message: `Kategori dengan nama: ${kategoriLayanan.nama_kategori} berhasil ditambahkan` }))
      .catch((err) => res.json(err));
  },

  deleteKategori: (req, res) => {
  	Kategori_layanan.deleteKategori(req.params.idKategori)
      .then(() => res.json({ msg: `Kategori layanan: ${req.params.idKategori} berhasil dihapus` }))
      .catch((err) => res.json(err));
  },

  updateKategori: (req, res) => {
  	Kategori_layanan.updateKategori(req.body, req.params.idKategori)
      .then(() => res.json({ msg: `Update Kategori layanan: ${req.params.idKategori} berhasil` }))
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

  tambahLayanan: (req, res) => {
  	Layanan.tambahLayanan(req.body)
      .then((layanan) =>
        res.json( { message: `Layanan ${layanan.nama_layanan} berhasil ditambahkan`} ))
      .catch((err) => res.json(err));
  },

  deleteLayanan: (req, res) => {
  	Layanan.deleteLayanan(req.params.idLayanan)
      .then(() => res.json({ msg: `Layanan berhasil dihapus` }))
      .catch((err) => res.json(err));
  },

  updateLayanan: (req, res) => {
  	Layanan.updateLayanan(req.body, req.params.idLayanan)
      .then(() => res.json({ msg: `Update Layanan: ${req.params.idLayanan} berhasil` }))
      .catch((err) => res.json(err));
  },

  getLayanan: (req, res) => {
  	Layanan.getLayanan(req.params.idLayanan)
      .then((layanan) => res.json(layanan))
      .catch((err) => res.json(err));
  },

};