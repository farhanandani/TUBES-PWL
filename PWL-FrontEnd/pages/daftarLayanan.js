import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from "next/router";
import Link from 'next/link'
import Image from 'next/image'

import style from '../styles/daftarLayanan.module.css';
import { whoami } from '../redux/actions/auth'

import Layout from '../components/layout'
import Swal from 'sweetalert2';
import { useCart } from "react-use-cart";


/* Fungsi formatRupiah */
function formatRupiah(angka, prefix){
  var number_string = angka.replace(/[^,\d]/g, '').toString(),
  split       = number_string.split(','),
  sisa        = split[0].length % 3,
  rupiah        = split[0].substr(0, sisa),
  ribuan        = split[0].substr(sisa).match(/\d{3}/gi);
 
  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if(ribuan){
    let separator
    separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }
 
  rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
  return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
}

export async function getServerSideProps(ctx) {
  const { req, res } = ctx
  const response = await fetch("https://sikatboss-backend.herokuapp.com/customer/whoami", {     
    headers: {
      cookie: req.headers.cookie
    }
  });

  const fetchKategori = await fetch("https://sikatboss-backend.herokuapp.com/customer/get_all_kategori");
  const kategori = await fetchKategori.json();
  const fetchLayanan = await fetch("https://sikatboss-backend.herokuapp.com/customer/get_all_layanan");
  const layanan = await fetchLayanan.json();


  if(response.status != 401){
    const data = await response.json();
    return {
    props: { data, kategori, layanan },
    };
  }
  else if(response.status == 401){
    return {
    props: { kategori, layanan },
    };
  }  
}

const daftarLayanan = ({data, kategori, layanan}) => {
  const dispatch = useDispatch()
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const router = useRouter();
  useEffect(() => {
    dispatch(whoami(data));
  }, [dispatch])
  
  const { addItem } = useCart();

  function tambahKeKeranjang(layanan){
    var new_obj = Object.assign({}, {["id"]: layanan["id"]},
                                    {["name"]: layanan["nama_layanan"]},
                                    {["price"]: layanan["harga"]}, 
                                    {["category"]: layanan["nama_kategori"]}, 
                                );
            
    addItem(new_obj);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: `Berhasil menambahkan ${new_obj.name} ke keranjang`,
      showConfirmButton: true,
      timer: 5000
    })
  };

  function belumLogin(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-warning btn-lg',
        cancelButton: 'btn btn-success btn-lg me-4'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Anda belum Login',
      text: "Untuk menggunakan layanan dari kami silahkan lakukan login terlebih dahulu",
      showCancelButton: true,
      confirmButtonText: 'Register',
      cancelButtonText: 'Login',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/register");
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        router.push("/login")
      }
    })
  }

  return (
    <>
      <Layout>
        <div className={style.containerUtama}> 
          <div className={`p-4 ${style.container_title}`}>
            <div className={`pt-2 ${style.title}`}>
              <h2 className="text-center"><strong>DAFTAR LAYANAN</strong><hr/></h2>
            </div>
          </div>
          <div className="d-flex flex-column py-5">
            {kategori.map((kategori, index) =>{
              const layanan_perkategori = layanan.filter( layanan => layanan.nama_kategori === kategori.nama_kategori);
              if ((index + 1) % 2 == 0 ) {
                return <div className={style.background_even} key={index}> 
                        <div className={`container my-5`}>
                          <div className="row row-cols-1 row-cols-md-2 gx-5">
                            <div className="col order-2 order-md-1">
                              <h3><strong>{kategori.nama_kategori}</strong></h3>
                              <div className="row row-cols-1 row-cols-md-2 g-4">
                              {layanan_perkategori.map((layanan,index)=> 
                                       (<div className="col" key={index}> 
                                          <div className="card">
                                            <div className="card-body">
                                              <h5 className="card-title">{layanan.nama_layanan}</h5>
                                              <p className="card-text">{layanan.deskripsi}</p>
                                            </div>
                                            <div className="card-footer">
                                              <div className="d-grid justify-content-start">
                                                <h6 className="pe-4 me-5">Harga: {formatRupiah(layanan.harga, "Rp. ")}</h6>
                                                <button type="button" className="btn btn-outline-dark" onClick={isLoggedIn ? ()=> tambahKeKeranjang(layanan) : ()=> belumLogin() }>Pesan</button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>)
                                )
                              }
                              </div>
                            </div>
                            <div className="col order-1 order-md-2">
                              <Image 
                              src={kategori.url_gambar}
                              width={503}
                              height={405}
                              layout="responsive"
                              className="" alt="..." />
                            </div>
                          </div>
                        </div>
                      </div>
              }
              else{
                return <div className={`container my-5`} key={index}>
                          <div className="row row-cols-1 row-cols-md-2 gx-5">
                            <div className="col">
                              <Image 
                              src={kategori.url_gambar}
                              width={503}
                              height={405}
                              layout="responsive"
                              className="" alt="..." />
                            </div>
                            <div className="col">
                              <h3><strong>{kategori.nama_kategori}</strong></h3>
                              <div className="row row-cols-1 row-cols-md-2 g-4">
                              {layanan_perkategori.map((layanan,index)=> 
                                       (<div className="col" key={index}>
                                          <div className="card">
                                            <div className="card-body">
                                              <h5 className="card-title">{layanan.nama_layanan}</h5>
                                              <p className="card-text">{layanan.deskripsi}</p>
                                            </div>
                                            <div className="card-footer">
                                              <div className="d-grid justify-content-start">
                                                <h6 className="pe-4 me-5">Harga:  {formatRupiah(layanan.harga, "Rp. ")}</h6>
                                                <button type="button" className="btn btn-outline-dark" onClick={isLoggedIn ? ()=> tambahKeKeranjang(layanan) : ()=> belumLogin() }>Pesan</button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>)
                                )
                              }
                              </div>
                            </div>
                          </div>
                        </div>
              }  
            })}    
          </div>
        </div>
      </Layout>
    </>
  )
}

export default daftarLayanan