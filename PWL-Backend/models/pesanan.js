'use strict';
const {
  Model
} = require('sequelize');

const Xendit = require('xendit-node');
const x = new Xendit({
  secretKey: process.env.XENDIT_SECRETKEY,
});

const { Invoice } = x;
const invoiceSpecificOptions = {};
const i = new Invoice(invoiceSpecificOptions);

module.exports = (sequelize, DataTypes) => {
  class Pesanan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Customer, 
                     {foreignKey: { name: 'id_customer' }, 
                      onDelete: 'SET NULL', 
                      onUpdate: 'CASCADE',
                      hooks: true,
                     }
      );
    }

    static getPesanansCostumer(idCostumer){
      return this.findAll({where: {id_customer: idCostumer}});
    }

    static getPesananById(idPesanan){
      return this.findByPk(idPesanan);
    }

    static buatInvoice(externalID, description, amount, items, given_names, mobile_number, ){
      return i.createInvoice({
                externalID: externalID,
                description: description,
                amount: amount,
                items: items,
                customer: {
                  given_names: given_names,
                  mobile_number: mobile_number,
                },
              })
    }

    static getInvoice(invoiceId){
      return i.getInvoice({ invoiceID: invoiceId });
    }

    static expireInvoice(invoiceId){
      return i.expireInvoice({ invoiceID: invoiceId });
    }

    static buatPesananEwallet({idCostumer, items, catatan, metodePengiriman, totalHarga, namaCustomer, noTeleponCustomer}) {
       return this.create({ id_customer: idCostumer, 
                           items: items, 
                           metode_pembayaran: "Ewallet", 
                           status_pesanan: "Belum Selesai", 
                           catatan: catatan, 
                           metode_pengiriman_pesanan: metodePengiriman,
                           total_harga: totalHarga
                         })
                  .then((pesanan)=>{
                    return this.buatInvoice(pesanan.id.toString(), pesanan.catatan, pesanan.total_harga, pesanan.items, namaCustomer, noTeleponCustomer )
                    .then((invoice)=>{
                      return this.update({invoice_id: invoice.id}, { where:{id: pesanan.id}, returning: true, plain: true })
                      .then((updatedPesanan)=>{return updatedPesanan[1]});
                    }).catch((e)=>{console.log(e)});   
                  });
    }

    static buatPesananCash({idCostumer, items, catatan, metodePengiriman, totalHarga}) {
      return this.create({
        id_customer: idCostumer, 
        items: items, 
        metode_pembayaran: "Cash",
        status_pembayaran: "Belum Dibayar",
        status_pesanan: "Belum Selesai", 
        catatan: catatan, 
        metode_pengiriman_pesanan: metodePengiriman,
        total_harga: totalHarga
      })
    }

    static batalkanPesanan(idPesanan){
      return this.findOne({ where: { id: idPesanan } })
        .then((pesanan)=>{
          if (pesanan.metode_pembayaran == "Cash") {
            if (pesanan.status_pembayaran == "Belum Dibayar") {
              return this.destroy({ where: {id: pesanan.id} });
            }
          }
          else if (pesanan.metode_pembayaran == "Ewallet"){
            return this.getInvoice(pesanan.invoice_id)
            .then((invoice)=>{
              if (invoice.status == "EXPIRED") {
                return this.destroy({ where: { id: pesanan.id } });  
              }
              else if (invoice.status == "PENDING") {
                return this.expireInvoice(pesanan.invoice_id)
                  .then((invoice)=>{
                    return this.destroy({ where: { id: pesanan.id } });
                  })
              }
            });
          }
        });   
    }

  };
  Pesanan.init({
    id_customer: DataTypes.INTEGER,
    items: DataTypes.JSONB,
    metode_pembayaran: DataTypes.STRING,
    status_pembayaran: DataTypes.STRING,
    status_pesanan: DataTypes.STRING,
    catatan: DataTypes.TEXT,
    metode_pengiriman_pesanan: DataTypes.STRING,
    total_harga: DataTypes.DECIMAL,
    invoice_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pesanan',
  });
  return Pesanan;
};