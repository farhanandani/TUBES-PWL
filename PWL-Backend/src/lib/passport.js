// import passport
const passport = require('passport');

// import strategi jwt untuk passport
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

// import model admin untuk membaca data admin dari tabel admin
const { Admin, Customer } = require('../../models');

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.accessToken;
  }
  return token;
};

// buat pengaturan pembacaan jwt
const options = {
  // jwt akan diambil dari request header yang bernama 'authorization'
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),

  // kunci yang digunakan untuk membaca jwt, harus sama dengan kunci yang digunakan untuk membuat jwt
  secretOrKey: 'secret',
};

passport.use('Admin', new JwtStrategy(options, (payload, done) => {
  // cari admin berdasarkan id menggunakan id yang ada di payload jwt
  // isi / payload jwt ditentukan ketika membuat jwt
  Admin.findOne({
    where: { id: payload.id },
  }).then((admin) => {
    // jika admin ditemukan, oper null sebagai nilai error & data admin ke callback
    done(null, admin);
  }).catch((err) => {
    // jika terjadi error, oper error & false ke callback
    // tujuan pengoperan false adalah agar callback tahu admin gagal ditemukan
    done(err, false);
  });
}));

passport.use('Customer', new JwtStrategy(options, (payload, done) => {
  // cari admin berdasarkan id menggunakan id yang ada di payload jwt
  // isi / payload jwt ditentukan ketika membuat jwt
  Customer.findOne({
    where: { id: payload.id },
  }).then((customer) => {
    // jika admin ditemukan, oper null sebagai nilai error & data admin ke callback
    done(null, customer);
  }).catch((err) => {
    // jika terjadi error, oper error & false ke callback
    // tujuan pengoperan false adalah agar callback tahu admin gagal ditemukan
    done(err, false);
  });
}));

// export passport beserta pengaturan yang telah dibuat
module.exports = passport;
