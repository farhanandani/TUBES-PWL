const { Pesanan } = require('../../../models');

module.exports = {

 getAllPesanan: (req, res) => {
  	Pesanan.findAll()
  	  .then( (pesanans) => res.json(pesanans) )
  	  .catch( (e) => res.json(e) )
  },

  getPesananById: (req, res) => {
    Pesanan.getPesananById(req.params.idPesanan)
      .then((pesanan) => res.json(pesanan))
      .catch((err) => res.json(err));
  },

  getPesanansCostumer: (req, res) => {
  	Pesanan.getPesanansCostumer(req.params.idCustomer)
      .then((pesanans) => res.json(pesanans))
      .catch((err) => res.json(err));
  },

  pesananSelesaiDicuci: (req, res) =>{
  	Pesanan.update({status_pesanan: "Sudah Selesai"}, { where: {id: req.params.idPesanan}, returning: true, plain: true })
  	  .then((pesanan) => res.json(pesanan))
  	  .catch((err) => res.json(err));
  },

  pesananSudahDibayar: (req, res) =>{
  	Pesanan.update({status_pembayaran: "Sudah Dibayar"}, { where: {id: req.params.idPesanan}, returning: true, plain: true })
  	  .then((pesanan) => res.json(pesanan))
  	  .catch((err) => res.json(err));
  },

  getInvoice: (req, res) => {
    Pesanan.getInvoice(req.params.idInvoice)
      .then( (invoice) => res.json(invoice))
      .catch((e) => res.json(e) )
  },

  

};