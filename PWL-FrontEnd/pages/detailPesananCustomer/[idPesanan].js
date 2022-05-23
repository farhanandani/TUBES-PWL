import { useSelector } from 'react-redux'
import Link from 'next/link'
import { whoami } from '../../redux/actions/auth'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useRouter } from "next/router";

import Layout from '../../components/layout'
import style from '../../styles/detailPesanan.module.css';
import axios from "axios";
import Swal from 'sweetalert2';


const formatRupiah = (money) => {
   return new Intl.NumberFormat('id-ID',
     { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }
   ).format(money);
}

const formatTanggal = (tanggal) => {
   const event = new Date(tanggal);
   const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
   return event.toLocaleDateString('id-ID', options);
}

export async function getServerSideProps(ctx) {
  const { req, res, params } = ctx

  const { idPesanan } = params; 

  const response = await fetch("https://sikatboss-backend.herokuapp.com/customer/whoami", {     
    headers: {
      cookie: req.headers.cookie
    }
  });

  const pesanan = await fetch(`https://sikatboss-backend.herokuapp.com/customer/get_pesanan_ById/${idPesanan}`, {     
    headers: {
      cookie: req.headers.cookie
    }
  });
  const dataPesanan = await pesanan.json();

  const invoice = await fetch(`https://sikatboss-backend.herokuapp.com/customer/get_invoice/${dataPesanan.invoice_id}`, {     
    headers: {
      cookie: req.headers.cookie
    }
  });

  const dataInvoice = await invoice.json();

  if(response.status == 401){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  else if(response.status != 401){
    const data = await response.json();
    return {
    props: { data, dataPesanan, dataInvoice },
    };
  }  
}


const detailPesananCustomer = ({ data, dataPesanan, dataInvoice }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(whoami(data));
  }, [dispatch])



  const batalkanPesanan = (idPesanan) => {
    axios.delete(`https://sikatboss-backend.herokuapp.com/customer/batalkan_pesanan/${idPesanan}`, {
      withCredentials: true
    }).then(()=>{
      router.push('/')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Pesanan Berhasil Dibatalkan',
        showConfirmButton: true,
      })
    })    
  };

  return (
    <>
      <Layout>
        <div className={style.containerUtama}>

          <div className={`p-4 ${style.container_title}`}>
            <div className={`pt-2 ${style.title}`}>
              <h2 className="text-center"><strong>Detail Pesanan</strong><hr/></h2>
            </div>
          </div>

          <div className={`container py-5`}>

            <div className="card mb-5" >
              <div className="card-body">
                <h4 className="card-title">Pesanan pada {formatTanggal(dataPesanan.createdAt)}</h4>
                <hr/>
                <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Kategori Layanan</th>
                      <th>Nama Layanan</th>
                      <th>Harga Perbarang</th>
                      <th>Jumlah Barang</th>
                      <th>Sub Total</th>
                    </tr>
                  </thead>
                  <tbody>
                  {dataPesanan.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.category}</td>
                        <td>{item.name}</td>
                        <td>{formatRupiah(item.price)}</td>
                        <td className="align-middle">
                          {item.quantity}
                        </td>
                        <td>{formatRupiah((item.quantity * item.price))}</td>
                      </tr>
                    ))
                  }
                  </tbody>
                </table> 
                   <div className="text-end"><strong>Total Harga: {formatRupiah(dataPesanan.total_harga)}</strong></div>
                </div>
                <div className="">
                  <div className="w-50 mb-3">
                    <label htmlFor="catatan" className="form-label">Catatan: </label>
                    <textarea className="form-control" id="catatan" rows="3" value={dataPesanan.catatan == " " ? "Tidak ada catatan untuk pesanan ini": dataPesanan.catatan} disabled readOnly></textarea>
                  </div>
                  <p><strong>Status Pesanan:</strong> 
                      {dataPesanan.status_pesanan == "Belum Selesai" ? <span className={style.statusPesananBelum}> Belum Selesai </span> 
                      : <span className={style.statusPesananSudah}> Sudah Selesai </span>}
                  </p>
                  <p><strong>Metode pengiriman:</strong> {dataPesanan.metode_pengiriman_pesanan}</p>
                  <p><strong>Metode pembayaran:</strong> {dataPesanan.metode_pembayaran}</p>
                  <p><strong>Status pembayaran:</strong> 
                    { 
                      dataPesanan.metode_pembayaran == "Cash" ? 
                      <span>{dataPesanan.status_pembayaran == "Sudah Dibayar" ? 
                        <span className={style.statusPesananSudah}> Sudah Dibayar </span> 
                         : 
                        <span className={style.statusPesananBelum}> Belum Dibayar</span> }
                      </span>
                      : 
                      <span>
                        {(dataInvoice.status == "PAID") || (dataInvoice.status == "SETTLED") ? 
                          <span className={style.statusPesananSudah}> Sudah Dibayar</span> 
                          :
                          <span>
                            {dataInvoice.status == "EXPIRED" ? <span className={style.statusPesananBelum}>Link pembayaran sudah Expired</span>
                              :
                              <span className={style.statusPesananBelum}>Belum Dibayar</span>
                            }
                          </span>
                        }
                      </span> 
                    }
                  </p>
                </div>
              </div>
            </div>


            <div className="d-grid gap-2 d-sm-block text-center">

              { dataPesanan.status_pembayaran == "Belum Dibayar" || (dataInvoice.status == "PENDING" || dataInvoice.status == "EXPIRED"  ) ?
                <button className="btn btn-lg btn-secondary" type="button" onClick={() => batalkanPesanan(dataPesanan.id) } type="button">Batalkan Pesanan</button>
                :
                ""
              }
      
              { dataPesanan.metode_pembayaran == "Ewallet" && (dataInvoice.status == "PENDING" ) ?
                <a href={dataInvoice.invoice_url} target="_blank" className="btn btn-lg btn-dark ms-md-5 ms-sm-5" >Bayar</a>
                :
                ""
              }
            </div>

          </div>

        </div>
      </Layout>
    </>
  )
}

export default detailPesananCustomer