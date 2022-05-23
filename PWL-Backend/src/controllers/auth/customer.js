// import jwt untuk membuat tken
const jwt = require('jsonwebtoken');
// import model
const bcrypt = require('bcrypt');
const { Customer } = require('../../../models');

// buat fungsi untuk membuat token jwt
const generateToken = (id, namaCustomer) => {
  // tentukan isi / payload dari jwt
  const payload = {
    id, // nilai id dalam payload didapat dari id dari paramter fungsi generateToken
    namaCustomer, // nilai nama_admin dalam payload didapat dari nama_admin dari paramter fungsi generateToken
  };

  // kunci yang digunakan untuk membuat jwt
  const secret = 'secret';

  // buat token jwt menggunakan payload & kunci rahasia yang telah ditentukan
  return jwt.sign(payload, secret);
};

module.exports = {
  login: (req, res) => {
    const { emailCustomer, password } = req.body;

    Customer.findOne({
      where: { email_customer: emailCustomer }, 
    }).then(async (customer) => {
      const match = await bcrypt.compare(password, customer.password);

      if (match) {
        const accessToken = generateToken(customer.id, customer.email_customer);

        if (customer.status != "active") {
          return res.status(401).json({
            message: "Akun Belum Terverifikasi, Silahkan lakukan Verifikasi melalui Email yang telah terdaftar",
          });
        } 

        if (customer.status == "active") {
          return res
          .cookie('accessToken', accessToken, {
            httpOnly: false,
            secure: true,
            sameSite: 'none'
          })
          .status(200)
          .json({ message: 'Log in Berhasil', token: accessToken });
        }
        
      }

      if (!match) {
        return res.json({ message: 'Email atau Password Salah' });
      }
    }).catch((err) => res.json({ message: 'Email atau Password Salah' }));
  },

  verifyCustomerEmail: (req, res) => {
    Customer.findOne({
      where: {confirmationCode: req.params.confirmationCode}
    })
      .then((customer) => {
        if (!customer) {
          return res.status(404).send({ message: "User Not found." });
        }
        Customer.update({ status:"active" }, { where:{id: customer.id} });
        return res.json({message: "anda telah berhasil login"})
      })
      .catch((e) => console.log("error", e));
  },

  whoami: (req, res) => res.json({
    id: req.user.id,
    nama_customer: req.user.nama_customer,
    email_customer: req.user.email_customer,
    no_telepon: req.user.no_telepon,
    alamat: req.user.alamat 
  }),

  logout: (req, res) => res
    .clearCookie('accessToken')
    .status(200)
    .json({ message: 'Berhasil logout' }),

};
