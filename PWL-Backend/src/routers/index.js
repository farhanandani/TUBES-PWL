const router = require('express').Router();
const auth = require('./auth');
const dashboard = require('./Dashboard');
const customer = require('./customer')

router.use('/auth', auth);
router.use('/dashboard', dashboard);
router.use('/customer', customer);


module.exports = router;
