// import model
const { Customer } = require('../../../models');

module.exports = {

  delete: (req, res) => {
    Customer.destroy({ where: { id: req.params.idCustomer } })
      .then(() => res.json({ msg: `Customer berhasil dihapus` }))
      .catch((err) => res.json(err));
  },

  getAllCustomer: (req, res) => {
  	Customer.findAll()
  	  .then((customers)=> res.json(customers))
  	  .catch((err) => res.json(err));
  },

  update: (req, res) => {
    Customer.updateCustomer(req.body, req.params.idCustomer)
      .then(() => res.json({ msg: "Update Costumer berhasil" }))
      .catch((err) => res.json(err));
  },

  getCustomerbyid: (req, res) => {
    Customer.findOne({ where: { id: req.params.idCustomer } })
    .then((customer) => res.json(customer))
    .catch((err) => res.json(err));
  },

};