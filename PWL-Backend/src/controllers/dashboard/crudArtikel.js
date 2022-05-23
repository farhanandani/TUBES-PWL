// import model
const { Artikel } = require('../../../models');

module.exports = {
  index: (req, res) => {
    Artikel.findAll()
      .then((artikels) => res.json(artikels))
      .catch((err) => res.json(err));
  },

  tambah: (req, res) => {
    Artikel.buatArticle(req.body)
      .then((artikel) =>
        res.json({ message: `Artikel dengan judul: ${artikel.judul_artikel} berhasil ditambahkan` }))
      .catch((err) => res.json(err));
  },

  delete: (req, res) => {
    Artikel.deleteArticle(req.params.id)
      .then((artikel) => res.json({ msg: `Artikel berhasil dihapus` }))
      .catch((err) => res.json(err));
  },

  update: (req, res) => {
    Artikel.updateArtikel(req.body, req.params.id)
      .then(() => res.json({ msg: "Update Artikel berhasil" }))
      .catch((err) => res.json(err));
  },

  getArtikelById: (req, res) => {
    Artikel.getArtikelById(req.params.id)
      .then((artikel) => res.json(artikel))
      .catch((err) => res.json(err));
  },

};