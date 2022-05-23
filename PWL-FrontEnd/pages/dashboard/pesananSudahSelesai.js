import Layout from '../../components/dashboard/layout'
import {DataTable} from "simple-datatables"
import Head from "next/head";



import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'

import { whoami } from '../../redux/actions/auth';

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
  const { req, res } = ctx
  const response = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/whoami", {     
    headers: {
      cookie: req.headers.cookie
    }
  });


  if(response.status != 401){
    const fetchCustomer = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/get_all_customers", {     
      headers: {
        cookie: req.headers.cookie
      }
    });

    const customers = await fetchCustomer.json();

    const fetchPesanan = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/get_all_pesanan", {     
      headers: {
        cookie: req.headers.cookie
      }
    });
    
    const all_pesanan = await fetchPesanan.json();
    var filteredPesanan = await all_pesanan.filter(a => a.status_pesanan == "Sudah Selesai");
    
    const pesanans = await Promise.all(
      filteredPesanan.map ( async (pesanan)=>{
        if(pesanan.metode_pembayaran == "Ewallet"){
          const fetchInvoice = await fetch(`https://sikatboss-backend.herokuapp.com/dashboard/get_invoice/${pesanan.invoice_id}`, {     
            headers: {
              cookie: req.headers.cookie
            }
          });
          const invoice = await fetchInvoice.json();
          if (invoice.status == "PAID" || invoice.status == "SETTLED" ){
            return {...pesanan, status_pembayaran: 'Sudah Dibayar'};
          }
          else if (invoice.status == "PENDING"){
            return {...pesanan, status_pembayaran: 'Belum Dibayar'};
          }
          else if (invoice.status == "EXPIRED"){
            return {...pesanan, status_pembayaran: 'Invoice Expired'}; 
          }
        }
        return pesanan;
    })
    );

    
    const data = await response.json();
    return {
    props: { data, pesanans, customers },
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

const pesananSudahSelesai = ({data, pesanans, customers}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(whoami(data));
    const dataTable = new DataTable("#pesananSudah");
  }, [dispatch])


  return (
    <>
      <Layout>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Pesanan Belum Selesai</h1>
          
          <div className="card mb-4">
            <div className="card-header">
                <i className="fas fa-table me-1"></i>
                Daftar Pesanan
            </div>
            <div className="card-body">
              <div className="table-responsive">
            	<table className="table" id="pesananSudah">
                  <thead>
                      <tr>
                          <th>Nama Pemesan</th>
                          <th>Tgl Pesanan</th>
                          <th>Status Pesanan</th>
                          <th>Total Harga</th>
                          <th>Status Pembayaran</th>
                          <th>Metode pengiriman</th>
                          <th>Action</th>
                      </tr>
                  </thead>
                  <tfoot>
                      <tr>
                          <th>Nama Pemesan</th>
                          <th>Tgl Pesanan</th>
                          <th>Status Pesanan</th>
                          <th>Total Harga</th>
                          <th>Status Pembayaran</th>
                          <th>Metode pengiriman</th>
                          <th>Action</th>
                      </tr>
                  </tfoot>
                  <tbody>
                      {
                        pesanans.map((pesanan, index)=>(
                          <tr key={index}>
                            <td>{customers.find(x => x.id === pesanan.id_customer).nama_customer}</td>
                            <td>{formatTanggal(pesanan.createdAt)}</td>
                            <td>{pesanan.status_pesanan}</td>
                            <td>{formatRupiah(pesanan.total_harga)}</td>
                            <td>{pesanan.status_pembayaran}</td>
                            <td>{pesanan.metode_pengiriman_pesanan}</td>
                            <td>
                              <Link href={`/dashboard/detailPesanan/${pesanan.id}`}>
                                <a className="btn btn-info">Detail</a>
                              </Link>
                            </td>
                          </tr>
                        ))
                      }
                  </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default pesananSudahSelesai