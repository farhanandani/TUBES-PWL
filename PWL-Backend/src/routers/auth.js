const router = require('express').Router();
const { auth } = require('../controllers');

router.post('/login_admin', auth.admin.login);
router.post('/login_costumer', auth.customer.login);
router.get("/verify/:confirmationCode", auth.customer.verifyCustomerEmail);

module.exports = router;
