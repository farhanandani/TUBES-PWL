const { Pesanan } = require('../../../models');

module.exports = {

  buatPesananEwallet: (req, res) => {
  	Pesanan.buatPesananEwallet(req.body)
  	  .then( (pesanan) => res.json(pesanan) )
  	  .catch( (e) => res.json(e) )
  },

  buatPesananCash: (req, res) => {
    Pesanan.buatPesananCash(req.body)
      .then( (pesanan) => res.json(pesanan) )
      .catch( (e) => res.json(e) )
  },

  getInvoice: (req, res) => {
  	Pesanan.getInvoice(req.params.idInvoice)
  	  .then( (invoice) => res.json(invoice))
  	  .catch((e) => res.json(e) )
  },
  
  batalkanPesanan: (req, res) => {
    Pesanan.batalkanPesanan(req.params.id)
      .then(() => res.json({msg: "Pesanan Berhasil Dibatalkan"}))
      .catch((err) => res.json(err));
  },

  getPesanansCostumer: (req, res) => {
  	Pesanan.getPesanansCostumer(req.params.idCustomer)
      .then((pesanans) => res.json(pesanans))
      .catch((err) => res.json(err));
  },

  getPesananById: (req, res) => {
    Pesanan.getPesananById(req.params.idPesanan)
      .then((pesanan) => res.json(pesanan))
      .catch((err) => res.json(err));
  }

};