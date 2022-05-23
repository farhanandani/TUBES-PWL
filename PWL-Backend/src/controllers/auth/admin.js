// import jwt untuk membuat tken
const jwt = require('jsonwebtoken');
// import model
const bcrypt = require('bcrypt');
const { Admin } = require('../../../models');

// buat fungsi untuk membuat token jwt
const generateToken = (id, namaAdmin) => {
  // tentukan isi / payload dari jwt
  const payload = {
    id, // nilai id dalam payload didapat dari id dari paramter fungsi generateToken
    namaAdmin, // nilai nama_admin dalam payload didapat dari nama_admin dari paramter fungsi generateToken
  };

  // kunci yang digunakan untuk membuat jwt
  const secret = 'secret';

  // buat token jwt menggunakan payload & kunci rahasia yang telah ditentukan
  return jwt.sign(payload, secret);
};

module.exports = {
  login: (req, res) => {
    const { namaAdmin, password } = req.body;

    Admin.findOne({
      where: { nama_admin: namaAdmin }, // gunakan nama_admin dari request body untuk mencari data Admin di tabel
    }).then(async (admin) => {
      const match = await bcrypt.compare(password, admin.password);
      // jika Admin berhasil ditemukan, pastikan password dari request body sesuai dengan password Admin di tabel
      if (match) {
        const accessToken = generateToken(admin.id, admin.nama_admin); // jalankan fungsi untuk membuat token, kemudian simpan hasil ke dalam accessToken

        return res
          .cookie('accessToken', accessToken, {
            httpOnly: false,
            secure: true,
            sameSite: 'none'
          })
          .status(200)
          .json({ message: 'Log in Berhasil', token: accessToken });
      }
      if (!match) {
        return res.json({ message: 'Username atau Password Salah' });
      }
    }).catch((err) => res.json({ message: 'Username atau Password Salah' }));
  },

  whoami: (req, res) => res.json({
    nama_admin: req.user.nama_admin,
    role: req.user.role,
  }),

  logout: (req, res) => res
    .clearCookie('accessToken')
    .status(200)
    .json({ message: 'Berhasil logout' }),

};
