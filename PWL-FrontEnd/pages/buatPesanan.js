import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from 'next/link';
import axios from "axios";

import { whoami } from "../redux/actions/auth";
import { updateCustomer } from "../redux/actions/customer";
import { clearMessage } from "../redux/actions/message";
import Layout from '../components/layout';

import style from '../styles/buatPesanan.module.css';
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';
import { useCart } from "react-use-cart";

export async function getServerSideProps(ctx) {
  const { req, res } = ctx
  const response = await fetch("https://sikatboss-backend.herokuapp.com/customer/whoami", {     
    headers: {
      cookie: req.headers.cookie
    }
  });
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
    props: { data },
    };
  }  
}

const InformasiPesanan = dynamic(
  () => import('../components/informasiPesanan.js'),
  { ssr: false }
)

function urutkanObject(obj, order) {
    var newObject = {};
    for(var i = 0; i < order.length; i++) {
        if(obj.hasOwnProperty(order[i])) {
            newObject[order[i]] = obj[order[i]];
        }
    }
    return newObject;
}

const buatPesanan = ({data}) => {

  const { message } = useSelector(state => state.message);
  const [MetodePemesanan, setMetodePemesanan] = useState("");
  const [MetodePembayaran, setMetodePembayaran] = useState("");
  const [catatan, setCatatan] = useState(" ");
  const dispatch = useDispatch();

  const router = useRouter();

  useEffect( () => {
    dispatch(clearMessage());
    dispatch(whoami(data));
    return () => {
      dispatch(clearMessage());
    }
  }, [dispatch])

  const {
    cartTotal,
    items,
    emptyCart 
  } = useCart();

  const onMetodePemesanan = (e) => {
    const MetodePemesanan = e.target.value;
    setMetodePemesanan(MetodePemesanan);
  };

  const onMetodePembayaran = (e) => {
    const MetodePembayaran = e.target.value;
    setMetodePembayaran(MetodePembayaran);
  };

  const onCatatan = (e) => {
    const catatan = e.target.value;
    setCatatan(catatan);
  };

  const handlePesan = () => {
    dispatch(clearMessage());
    if(MetodePemesanan == "" && MetodePembayaran == ""){
      Swal.fire({
        position: 'center',
        icon: 'question',
        title: 'Metode Pembayaran dan Metode Pengiriman Belum ditentukan',
        text: 'Silahkan isi Metode Pengiriman dan Pembayaran terlebih dahulu',
        showConfirmButton: true,
      })
    }
    else if(MetodePemesanan == ""){
      Swal.fire({
        position: 'center',
        icon: 'question',
        title: 'Metode Pengiriman Belum ditentukan',
        text: 'Silahkan isi Metode Pengiriman terlebih dahulu',
        showConfirmButton: true,
      }) 
    }
    else if(MetodePembayaran == ""){
      Swal.fire({
        position: 'center',
        icon: 'question',
        title: 'Metode Pembayaran Belum ditentukan',
        text: 'Silahkan isi Metode Pembayaran terlebih dahulu',
        showConfirmButton: true,
      })
    }
    else{
      let barang = items.map(({ id, itemTotal, ...item }) => {
                     item.price = Number(item.price);
                     return urutkanObject(item, ['name','quantity','price','category']);
                   });
      if(MetodePembayaran == "Cash"){
        var pesanan = Object.assign({}, 
                                    {["idCostumer"]: data["id"]},
                                    {["items"]: barang},
                                    {["catatan"]: catatan},
                                    {["metodePengiriman"]: MetodePemesanan},
                                    {["totalHarga"]: cartTotal}
        );
        const toJson = JSON.stringify(pesanan); 
        axios.post('https://sikatboss-backend.herokuapp.com/customer/buat_pesanan_cash', toJson, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
         .then((res)=>{
          emptyCart();
          router.push(`detailPesananCustomer/${res.data.id}`);
         });
      }
      else if(MetodePembayaran == "Ewallet"){
        var pesanan = Object.assign({}, 
                                    {["idCostumer"]: data["id"]},
                                    {["items"]: barang},
                                    {["catatan"]: catatan},
                                    {["metodePengiriman"]: MetodePemesanan},
                                    {["totalHarga"]: cartTotal},
                                    {["namaCustomer"]: data["nama_customer"]},
                                    {["noTeleponCustomer"]: data["no_telepon"]},
        );
        const toJson = JSON.stringify(pesanan);
        axios.post('https://sikatboss-backend.herokuapp.com/customer/buat_pesanan_ewallet', toJson, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
         .then((res)=>{
          emptyCart();
          router.push(`detailPesananCustomer/${res.data.id}`)
         });
      }
    }
    
  };
  
  return (
    <Layout>
    <div className={style.containerUtama}>

      <div className={`p-4 ${style.container_title}`}>
        <div className={`pt-2 ${style.title}`}>
          <h2 className="text-center"><strong>Buat Pesanan</strong><hr/></h2>
        </div>
      </div>

      <div className={`container py-5`}>
        
        <div className="card mb-5" >
          <div className="card-body">
            <h4 className="card-title">Informasi Penerima</h4>
            <hr/>
            <div className="container">
              <div className="row">
                <div className="col">
                  <p className="card-text"><strong>{data.nama_customer}</strong></p>
                  <p className="card-text"><strong>{data.no_telepon}</strong></p>
                </div>
                <div className="col">
                  <p className="card-text">{data.alamat}</p>
                </div>
                <div className="col">
                  <div className="alert alert-info" role="alert">
                    Edit di Profile jika ingin mengubah Alamat
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-5" >
          <div className="card-body">
            <h4 className="card-title">Layanan yang dipesan</h4>
            <hr/>
            <InformasiPesanan/>
            <div className="w-50 mb-3">
              <label htmlFor="catatan" className="form-label">Catatan: </label>
              <textarea className="form-control" id="catatan" onChange={onCatatan} rows="3" placeholder="Tulis catatan anda disini"></textarea>
            </div>
          </div>
        </div>

        <div className="card mb-5" >
          <div className="card-body">
            <h4 className="card-title">Metode Pembayaran dan Pemesanan</h4>
            <hr/>
            <div className="row row-cols-1 row-cols-md-2">
              <div className="col mb-4">
                <h5>Pengiriman barang</h5>
                <div className="form-check ms-1">
                    <input className="form-check-input" type="radio" name="metodePengiriman" id="metodePengiriman" 
                    value="Ambil ke Toko" onChange={onMetodePemesanan}/>
                    <label className="form-check-label" htmlFor="metodePengiriman">
                      Ambil ke Toko
                    </label>
                </div>
                <div className="form-check ms-1">
                    <input className="form-check-input" type="radio" name="metodePengiriman" id="metodePengiriman" 
                      value="Antar jemput" onChange={onMetodePemesanan}/>
                    <label className="form-check-label" htmlFor="metodePengiriman">
                      Gunakan jasa antar jemput
                    </label>
                </div>
              </div>
              <div className="col">
                <h5>Metode Pembayaran</h5>
                <div className="form-check ms-1">
                    <input className="form-check-input" type="radio" name="metodePembayaran" id="metodePembayaran"
                      value="Cash" onChange={onMetodePembayaran}/>
                    <label className="form-check-label" htmlFor="metodePembayaran">
                      Cash/Offline
                    </label>
                </div>
                <div className="form-check ms-1">
                    <input className="form-check-input" type="radio" name="metodePembayaran" id="metodePembayaran"
                    value="Ewallet" onChange={onMetodePembayaran}/>
                    <label className="form-check-label" htmlFor="metodePembayaran">
                      Ewallet(DANA/OVO)
                    </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-grid gap-2 d-sm-block text-center">
          <button className="btn btn-lg btn-secondary" type="button" onClick={()=> router.back()}>Kembali</button>
          <button className="btn btn-lg btn-dark ms-md-5 ms-sm-5" type="button" onClick={handlePesan}>Buat Pesanan</button>
        </div>

      </div>

    </div>
    </Layout>
  );
  
  
};
export default buatPesanan;