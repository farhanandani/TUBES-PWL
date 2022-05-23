const router = require('express').Router();
const authenticate = require('../middlewares/authenticate');
const { dashboard } = require('../controllers');
const { auth } = require('../controllers');
const { registerAdminRules, updateAdminRules, 
		tambahKategoriRules, updateKategoriRules,
		layanan,
		artikel,
		updateCustomerRules, 
		validate } = require('../lib/validator.js');

router.use(authenticate.admin);

//endpoint management admin
router.get('/get_all_admin', dashboard.crudAdmin.index);
router.post('/register_admin',registerAdminRules(), validate, dashboard.crudAdmin.register);
router.delete('/delete_admin/:namaAdmin', dashboard.crudAdmin.delete);
router.put('/update_admin/:id',updateAdminRules(), validate, dashboard.crudAdmin.update);

//endpoint Admin yg sedang login dan Logout
router.get('/whoami', auth.admin.whoami);
router.get('/logout', auth.admin.logout);

//endpoint management Artikel
router.get('/get_all_artikel', dashboard.crudArtikel.index);
router.get('/get_artikel_by_id/:id', dashboard.crudArtikel.getArtikelById);
router.post('/tambah_artikel', artikel(), validate, dashboard.crudArtikel.tambah);
router.delete('/delete_artikel/:id', dashboard.crudArtikel.delete);
router.put('/update_artikel/:id', artikel(), validate, dashboard.crudArtikel.update);

//management layanan
//------kategori--------------//
router.get('/get_all_kategori', dashboard.layanan.getAllKategori);
router.get('/get_kategori_by_id/:idKategori', dashboard.layanan.getKategori);
router.post('/tambah_kategori', tambahKategoriRules(), validate, dashboard.layanan.tambahKategori);
router.delete('/delete_kategori/:idKategori', dashboard.layanan.deleteKategori);
router.put('/update_kategori/:idKategori', updateKategoriRules(), validate, dashboard.layanan.updateKategori);
//------layanan--------------//
router.get('/get_all_layanan', dashboard.layanan.getAllLayanan);
router.get('/get_layanan_by_id/:idLayanan', dashboard.layanan.getLayanan);
router.post('/tambah_layanan', layanan(), validate, dashboard.layanan.tambahLayanan);
router.delete('/delete_layanan/:idLayanan', dashboard.layanan.deleteLayanan);
router.put('/update_layanan/:idLayanan', layanan(), validate, dashboard.layanan.updateLayanan);

//endpoint management akun customer
router.get('/get_all_customers', dashboard.akunCustomer.getAllCustomer);
router.delete('/delete_customer/:idCustomer', dashboard.akunCustomer.delete);
router.put('/update_costumer/:idCustomer', updateCustomerRules(), validate, dashboard.akunCustomer.update);
router.get('/get_customer_by_id/:idCustomer', dashboard.akunCustomer.getCustomerbyid)

//endpoint Pesanan
router.get('/get_all_pesanan', dashboard.pesanan.getAllPesanan);
router.get('/get_pesanan_ById/:idPesanan', dashboard.pesanan.getPesananById);
router.get('/get_pesanans_costumer/:idCustomer', dashboard.pesanan.getPesanansCostumer);
router.put('/pesanan_selesai_dicuci/:idPesanan', dashboard.pesanan.pesananSelesaiDicuci);
router.put('/pesanan_sudah_dibayar/:idPesanan', dashboard.pesanan.pesananSudahDibayar);
router.get('/get_invoice/:idInvoice', dashboard.pesanan.getInvoice);


module.exports = router;
