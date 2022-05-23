const passport = require('../lib/passport');

module.exports = {
  admin: passport.authenticate('Admin', { session: false }),
  customer: passport.authenticate('Customer', { session: false }),
};
