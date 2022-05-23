'use strict';
const {
  Model
} = require('sequelize');

/* import bcrypt untuk melakukan enkripsi */
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    // Method untuk melakukan enkripsi
    static async encrypt(password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      return hashedPassword
    }

    /* Method register, untuk menambahkan Admin */
    static async register({ namaAdmin, password }) {
      const encryptedPassword = await this.encrypt(password);
      /*
        encrypt dari static method
        encryptedPassword akan sama dengan string hasil enkripsi password dari method encrypt
      */
      return this.create({ nama_admin: namaAdmin, password: encryptedPassword, role:"Karyawan" });
    }

    /* Method update, untuk update Admin */
    static async updateAdmin({ namaAdmin, password },id) {
      if (password != "") {
        const encryptedPassword = await this.encrypt(password);
        return this.update({ nama_admin: namaAdmin, password: encryptedPassword }, { where:{id: id} });
      }
      else{
        return this.update({ nama_admin: namaAdmin }, { where:{id: id} });
      }
      
    }

   };
  Admin.init({
    nama_admin: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};