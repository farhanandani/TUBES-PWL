import Layout from '../../../components/dashboard/layout'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from "next/router";
import Link from 'next/link'
import Image from 'next/image'

import { whoami } from '../../../redux/actions/auth';
import style from '../../../styles/detailPesanan.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'

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

  const response = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/whoami", {     
    headers: {
      cookie: req.headers.cookie
    }
  });

  const pesanan = await fetch(`https://sikatboss-backend.herokuapp.com/dashboard/get_pesanan_ById/${idPesanan}`, {     
    headers: {
      cookie: req.headers.cookie
    }
  });
  const dataPesanan = await pesanan.json();

  const invoice = await fetch(`https://sikatboss-backend.herokuapp.com/dashboard/get_invoice/${dataPesanan.invoice_id}`, {     
    headers: {
      cookie: req.headers.cookie
    }
  });

  const dataInvoice = await invoice.json();

  const fetchCustomer = await fetch(`https://sikatboss-backend.herokuapp.com/dashboard/get_customer_by_id/${dataPesanan.id_customer}`, {     
    headers: {
      cookie: req.headers.cookie
    }
  });

  const customer = await fetchCustomer.json();


  if(response.status != 401){
    
    const data = await response.json();
    return {
    props: { data, dataPesanan, dataInvoice, customer },
    };
  }
  else if(response.status == 401){
    return {
      redirect: {
        destination: '/dashboard/loginAdmin',
        permanent: false,
      },
    }
  }  
}

const detailPesanan = ({ data, dataPesanan, dataInvoice, customer }) => {
  const dispatch = useDispatch()
  const router = useRouter();

  useEffect(() => {
    dispatch(whoami(data));
  }, [dispatch])

  const selesaikanPesanan = (idPesanan) => {

    fetch(`https://sikatboss-backend.herokuapp.com/dashboard/pesanan_selesai_dicuci/${idPesanan}`, {
      method: 'PUT',
      credentials: 'include'
    }).then(()=>{
      router.push(`/dashboard/detailPesanan/${idPesanan}`)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Pesanan Berhasil Diselesaikan',
        showConfirmButton: true,
      })
    })    
  };


  const selesaikanPembayaran = (idPesanan) => {

    fetch(`https://sikatboss-backend.herokuapp.com/dashboard/pesanan_sudah_dibayar/${idPesanan}`, {
      method: 'PUT',
      credentials: 'include'
    }).then(()=>{
      router.push(`/dashboard/detailPesanan/${idPesanan}`)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Pesanan Berhasil Terbayar',
        showConfirmButton: true,
      })
    })    
  };

  return (
    <>
      <Layout>
        <div className="container-fluid px-4">
          <button className="btn btn-primary btn-lg mt-3" type="button" onClick={() => router.back()}>
            <FontAwesomeIcon icon={faAngleLeft} />Kembali
          </button>
          <h1 className="mt-4">Detail Pesanan</h1>
          <div className="card mb-4">
            <div className="card-body">
                <h4 className="card-title">Pesanan pada {formatTanggal(dataPesanan.createdAt)}</h4>
                <hr/>
                <p><strong>Nama Pemesan : </strong><span>{customer.nama_customer}</span></p>
                <div className="w-50 mb-3">
                  <label htmlFor="alamat" className="form-label"><strong>Alamat</strong>: </label>
                  <textarea className="form-control" id="alamat" rows="3" value={customer.alamat} disabled readOnly></textarea>
                </div>
                <p><strong>Email Pemesan : </strong><span>{customer.email_customer}</span></p>
                <p><strong>No Telepon Pemesan : </strong><span>{customer.no_telepon}</span></p>
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

              <div className="d-grid gap-2 d-sm-block text-center">
                { dataPesanan.metode_pembayaran == "Cash" && dataPesanan.status_pembayaran == "Belum Dibayar" ?
                  <button className="btn btn-lg btn-success" type="button" onClick={() => selesaikanPembayaran(dataPesanan.id) } type="button">Telah Melakukan Pembayaran</button>
                  :
                  ""
                }
        
                { dataPesanan.status_pesanan == "Belum Selesai" ?
                  <button className="btn btn-lg btn-success ms-3" type="button" onClick={() => selesaikanPesanan(dataPesanan.id) } type="button">Pesanan Telah Selesai</button>
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

export default detailPesanan