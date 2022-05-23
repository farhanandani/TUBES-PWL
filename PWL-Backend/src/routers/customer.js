const router = require('express').Router();
const authenticate = require('../middlewares/authenticate');

const { auth } = require('../controllers');
const { customer } = require('../controllers');

const {validate, registerCustomerRules, updateCustomerRules} = require('../lib/validator.js');


//Lihat Artikel dan Layanan
router.get('/get_all_artikel', customer.lihatArtikel.allArtikel);
router.get('/get_artikel_by_id/:id', customer.lihatArtikel.getArtikelById);
router.get('/get_all_kategori', customer.lihatLayanan.getAllKategori);
router.get('/get_kategori_by_id/:idKategori', customer.lihatLayanan.getKategori);
router.get('/get_all_layanan', customer.lihatLayanan.getAllLayanan);
router.get('/get_layanan_by_id/:idLayanan', customer.lihatLayanan.getLayanan);

//register
router.post('/register_customer', registerCustomerRules(), validate, customer.akunCustomer.register);

//-----------------------Endpoint dibawah dan setelahnya memiliki autentikasi-----------------------
//Endpoint customer yg sudah login dan logout
router.get('/whoami', authenticate.customer, auth.customer.whoami); 
router.get('/logout', authenticate.customer, auth.customer.logout); 

//Akun Costumer
router.put('/update_customer/:id', authenticate.customer, updateCustomerRules(), validate, customer.akunCustomer.update); 

//Pemesanan
router.post('/buat_pesanan_ewallet', authenticate.customer, customer.pesanan.buatPesananEwallet); 
router.post('/buat_pesanan_cash', authenticate.customer, customer.pesanan.buatPesananCash);
router.delete('/batalkan_pesanan/:id', authenticate.customer, customer.pesanan.batalkanPesanan);
router.get('/get_invoice/:idInvoice', authenticate.customer, customer.pesanan.getInvoice);
router.get('/get_pesanans_costumer/:idCustomer', authenticate.customer, customer.pesanan.getPesanansCostumer);
router.get('/get_pesanan_ById/:idPesanan', authenticate.customer, customer.pesanan.getPesananById);





module.exports = router;

