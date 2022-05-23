// import model
const { Admin } = require('../../../models');

module.exports = {
  index: (req, res) => {
    Admin.findAll()
      .then((admins) => res.json(admins))
      .catch((err) => res.json(err));
  },

  register: (req, res) => {
    Admin.register(req.body)
      .then((admin) =>
        res.json({ message: `Admin dengan nama ${admin.nama_admin} berhasil ditambahkan` }))
      .catch((err) => res.json(err));
  },

  delete: (req, res) => {
    Admin.destroy({ where: { nama_admin: req.params.namaAdmin } })
      .then(() => res.json({ msg: `Admin dengan Username ${req.params.namaAdmin} berhasil dihapus` }))
      .catch((err) => res.json(err));
  },

  update: (req, res) => {
    Admin.updateAdmin(req.body, req.params.id)
      .then(() => res.json({ msg: "Update Admin berhasil" }))
      .catch((err) => res.json(err));
  },

};
