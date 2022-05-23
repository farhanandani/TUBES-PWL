// import model
const { Artikel } = require('../../../models');

module.exports = {
  allArtikel: (req, res) => {
    Artikel.findAll()
      .then((artikels) => res.json(artikels))
      .catch((err) => res.json(err));
  },

  getArtikelById: (req, res) => {
    Artikel.getArtikelById(req.params.id)
      .then((artikel) => res.json(artikel))
      .catch((err) => res.json(err));
  },

};
