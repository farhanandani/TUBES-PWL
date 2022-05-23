import Head from "next/head";
import Link from 'next/link';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/auth";
import { useRouter } from "next/router";

import { clearMessage } from "../redux/actions/message";
import style from '../styles/navbar.module.css';

import Swal from 'sweetalert2';
import { useCart } from "react-use-cart";

import dynamic from 'next/dynamic';
import $ from "jquery";
import { removeCookies } from 'cookies-next';

const Cart = dynamic(
  () => import('./cart.js'),
  { ssr: false }
)

const Navbar = ({items}) => {

  const { isLoggedIn, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

   const {
    isEmpty,
    totalUniqueItems,
    updateItemQuantity,
    removeItem,
  } = useCart();

  const handleLogout = (e) =>  {
    dispatch(logout());
    removeCookies("accessToken", { path: '/', domain: 'sikatboss.herokuapp.com' });
    router.push("/");
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Logout Berhasil',
      showConfirmButton: true,
      timer: 5000
    })
  }

  const handleBuatPesanan = () =>  {
    if(isEmpty){
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Keranjang Masih Kosong!',
        text: 'Silahkan pilih layanan yang ingin dipesan terlebih dahulu',
        showConfirmButton: true,
        timer: 10000
      })
    }
    else{
      $( "#tutup" ).trigger( "click" );
      router.push("/buatPesanan");
    }
  }

  return (
    <>
      <header className={`p-3 bg-dark text-light ${style.background}`}>
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <Link href="/">
              <a className="d-flex align-items-center mb-2 mb-lg-0 text-light text-decoration-none me-lg-auto">
                <span><h3><strong>SIKATBOSS.CO</strong></h3></span>
              </a>
            </Link>

            <ul className="nav col-12 col-lg-auto mb-2 justify-content-center mb-md-0">
              <li className="nav-item">
                <Link href="/"><a className={router.pathname == '/' ? 'nav-link px-2 h5 text-secondary' : 'nav-link px-2 h5 text-light'}>Beranda</a></Link>
              </li>
              <li className="nav-item">
                <Link href="/artikel"><a className={router.pathname == '/artikel' ? 'nav-link px-2 h5 text-secondary' : 'nav-link px-2 h5 text-light'}>Artikel</a></Link>
              </li>
              <li className="nav-item">
                <Link href="/daftarLayanan"><a className={router.pathname == '/daftarLayanan' ? 'nav-link px-2 h5 text-secondary' : 'nav-link px-2 h5 text-light'}>Layanan</a></Link>
              </li>
              <li className="nav-item">
                <Link href="/kontak"><a className={router.pathname == '/kontak' ? 'nav-link px-2 h5 text-secondary' : 'nav-link px-2 h5 text-light'}>Kontak</a></Link>
              </li>
            </ul>

            <div className="d-flex text-end ms-md-4">
              
              {
                isLoggedIn&&(router.pathname != '/buatPesanan') ?
                  <button className="btn btn-light me-3" data-bs-toggle="modal" data-bs-target="#keranjangPesanan">
                    <img src="/images/ShoppingCart.png" width="30" /> Keranjang Pesanan<strong>({totalUniqueItems})</strong>
                  </button>
                : ""
              } 

              {
                isLoggedIn ? 
                <div className="dropdown">
                  <button className="d-block btn btn-outline-light me-2 p-2 dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    <strong>{user.nama_customer}</strong>
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><Link href="/profil"><a className="dropdown-item" href="#">Profil</a></Link></li>
                    <li><Link href="/historyPesanan"><a className="dropdown-item" href="#">History Pemesanan</a></Link></li>
                  </ul>
                </div>
                :<Link href="/login"><button type="button" className="btn btn-outline-light me-2 p-2" onClick={(e) => {dispatch(clearMessage())}}><strong>Login</strong></button></Link>

              }

              {
                isLoggedIn ? 
                <button type="button" className="btn btn-warning p-2 ms-2" onClick={handleLogout}><strong>Logout</strong></button>
                :<Link href="/register"><button type="button" className="btn btn-warning p-2 ms-2" onClick={(e) => {dispatch(clearMessage())}}><strong>Register</strong></button></Link>
              }
            </div>
          </div>
        </div>
      </header>
      <div className="modal fade" id="keranjangPesanan" tabIndex="-1" aria-labelledby="keranjangPesananLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="keranjangPesananLabel"><img src="/images/ShoppingCart.png" width="30" /> Keranjang Pesanan</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">      
              <Cart/>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-lg" data-bs-dismiss="modal" id="tutup">Tutup</button>
              <button type="button" className="btn btn-primary btn-lg" onClick={handleBuatPesanan}>Buat Pesanan</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar;