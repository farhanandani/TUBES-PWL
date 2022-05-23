// import model
const { Customer } = require('../../../models');
const nodemailer = require("../../lib/nodemailer");
module.exports = {

  register: (req, res) => {
    Customer.register(req.body)
      .then((customer) =>{
        nodemailer.sendConfirmationEmail(
              customer.nama_customer,
              customer.email_customer,
              customer.confirmationCode
            );
        return res.json({ msg: `Register Berhasil, Silahkan melakukan verifikasi akun melalui Email` });
        })
      .catch((err) => res.json(err));
  },

  update: (req, res) => {
    Customer.updateCustomer(req.body, req.params.id)
      .then(() => res.json({ msg: "Update Profil Berhasil" }))
      .catch((err) => res.json(err));
  },

};