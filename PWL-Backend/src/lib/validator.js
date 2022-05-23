const { body, validationResult } = require('express-validator');
const { Admin, Kategori_layanan, Layanan, Customer } = require('../../models');

const registerAdminRules = () => {
  return [
    body('namaAdmin', 'Nama Admin tidak boleh kosong').isLength({ min: 1 }).trim(),
    body('namaAdmin').custom(value => {
      return Admin.findOne({ where: { nama_admin: value } }).then(namaAdmin => {
        if (namaAdmin) {
          return Promise.reject('Nama Admin Telah digunakan');
        }
      });
    }),
    body('password', 'Password tidak boleh kosong').isLength({ min: 1 }),
  ]
}

const updateAdminRules = () => {
  return [
    body('namaAdmin', 'Nama Admin tidak boleh kosong').isLength({ min: 1 }).trim(),
    body('namaAdmin').custom((value, {req, res}) => {
      return Admin.findOne({ where: { nama_admin: value } }).then(namaAdmin => {
        if (namaAdmin && namaAdmin.id != req.params.id) {
          return Promise.reject('Nama Admin Telah digunakan');
        }
      });
    }),
  ]
}

const artikel = () => {
  return [
    body('judulArtikel', 'Judul Artikel tidak boleh kosong').isLength({ min: 1 }).trim(),
    body('isiArtikel', 'Isi Artikel tidak boleh kosong').isLength({ min: 1 }),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(400).json({ errors: extractedErrors })
}

const tambahKategoriRules = () => {
  return [
    body('namaKategori', 'Nama Kategori tidak boleh kosong').isLength({ min: 1 }).trim(),
    body('namaKategori').custom(value => {
      return Kategori_layanan.findOne({ where: { nama_kategori: value } }).then(kategori => {
        if (kategori) {
          return Promise.reject('Nama Kategori Telah digunakan');
        }
      });
    }),
  ]
}

const updateKategoriRules = () => {
  return [
    body('namaKategori', 'Nama Kategori tidak boleh kosong').isLength({ min: 1 }).trim(),
    body('namaKategori').custom((value, {req, res}) => {
      return Kategori_layanan.findOne({ where: { nama_kategori: value } }).then(kategori => {
        if (kategori && kategori.nama_kategori != req.params.idKategori) {
          return Promise.reject('Nama Kategori Telah digunakan');
        }
      });
    }),
  ]
}

const layanan = () => {
  return [
    body('namaLayanan', 'Nama Layanan tidak boleh kosong').isLength({ min: 1 }).trim(),
    body('harga', 'Harga Layanan tidak boleh kosong').isLength({ min: 1 }),
  ]
}

const registerCustomerRules = () => {
  return [
    body('emailCustomer').isLength({ min: 1 }).withMessage('Email tidak boleh kosong').isEmail().withMessage('Format Harus Email').trim(),
    body('emailCustomer').custom((value, {req, res}) => {
      return Customer.findOne({ where: { email_customer: value } }).then(customer => {
        if (customer) {
          return Promise.reject('Email telah digunakan');
        }
      });
    }),
    body('namaCustomer', 'Nama tidak boleh kosong').isLength({ min: 1 }),
    body('noTelepon', 'No Telepon tidak boleh kosong').isLength({ min: 1 }),
    body('password', 'Password tidak boleh kosong').isLength({ min: 1 }),
  ]
}

const updateCustomerRules = () => {
  return [
    body('emailCustomer').isLength({ min: 1 }).withMessage('Email tidak boleh kosong').isEmail().withMessage('Format Harus Email').trim(),
    body('emailCustomer').custom((value, {req, res}) => {
      return Customer.findOne({ where: { email_customer: value } }).then(customer => {
        if (customer && customer.id != req.params.id) {
          return Promise.reject('Email telah digunakan');
        }
      });
    }),
    body('namaCustomer', 'Nama tidak boleh kosong').isLength({ min: 1 }),
    body('noTelepon', 'No Telepon tidak boleh kosong').isLength({ min: 1 }),

  ]
}

module.exports = {
  updateAdminRules,
  registerAdminRules,
  artikel,
  tambahKategoriRules,
  updateKategoriRules,
  layanan,
  registerCustomerRules,
  updateCustomerRules,
  validate,
}