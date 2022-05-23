import Head from "next/head";
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTachometerAlt, faAngleDown, faUser, faFw, faBasketShopping, faBellConcierge, faUserPen, faAlignLeft } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { logoutAdmin } from "../../redux/actions/auth";
import Swal from 'sweetalert2';
import { removeCookies } from 'cookies-next';


export default function Layout({ children }) {
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = (e) =>  {
    dispatch(logoutAdmin());
    removeCookies("accessToken", { path: '/', domain: 'sikatboss.herokuapp.com' });
    router.push("/dashboard/loginAdmin");
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Logout Berhasil',
      showConfirmButton: true,
      timer: 5000
    })
  }

  const toggled = (e) => {
    event.preventDefault();
    document.body.classList.toggle('sb-sidenav-toggled');
    localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
  }

  return (
    <>
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
          {/*<!-- Navbar Brand-->*/}
          <Link href="/dashboard">
            <a className="navbar-brand ps-3">SIKATBOSS.CO</a>
          </Link>
          {/*<!-- Sidebar Toggle-->*/}
          <button className="btn btn-link btn-lg order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" onClick={toggled} href="#!"><FontAwesomeIcon icon={faBars} /></button>
          {/*<!-- Navbar-->*/}
          <ul className="navbar-nav ms-auto me-3 me-lg-4">

              <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="d-inline me-1">{user && user.nama_admin}</div><FontAwesomeIcon icon={faUser} />
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                      <li><a className="dropdown-item" onClick={handleLogout} >Logout</a></li>
                  </ul>
              </li>
          </ul>
      </nav>
      <div id="layoutSidenav">
          <div id="layoutSidenav_nav">
              <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                  <div className="sb-sidenav-menu">
                      <div className="nav">
                          <a href="/dashboard" className="nav-link">
                              <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faTachometerAlt} /></div>
                              Dashboard
                          </a>

                          <a className="nav-link collapsed" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                              <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faBasketShopping} /></div>
                              PESANAN
                              <div className="sb-sidenav-collapse-arrow"><FontAwesomeIcon icon={faAngleDown} /></div>
                          </a>
                          <div className="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                              <nav className="sb-sidenav-menu-nested nav">
                                <Link href="/dashboard/pesananBelumSelesai">
                                  <a className="nav-link">Daftar Pesanan (Belum Selesai)</a>
                                </Link>
                                <Link href="/dashboard/pesananSudahSelesai">
                                  <a className="nav-link">Daftar Pesanan (Sudah Selesai)</a>
                                </Link>   
                              </nav>
                          </div>

                          <a className="nav-link collapsed" data-bs-toggle="collapse" data-bs-target="#layanan" aria-expanded="false" aria-controls="layanan">
                              <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faBellConcierge} /></div>
                              Layanan
                              <div className="sb-sidenav-collapse-arrow"><FontAwesomeIcon icon={faAngleDown} /></div>
                          </a>
                          <div className="collapse" id="layanan" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                              <nav className="sb-sidenav-menu-nested nav">
                                <Link href="/dashboard/kategoriLayanan" >
                                  <a className="nav-link">Kategori Layanan</a>
                                </Link>
                                <Link href="/dashboard/daftarLayanan">
                                  <a href="/dashboard/daftarLayanan" className="nav-link">Daftar Layanan</a>   
                                </Link>
                              </nav>
                          </div>

                          <Link href="/dashboard/akunAdmin">
                            <a className="nav-link">
                                <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faUserPen} /></div>
                                Akun Admin
                            </a>
                          </Link>

                          <Link href="/dashboard/daftarArtikel">
                          <a className="nav-link">
                              <div className="sb-nav-link-icon"><FontAwesomeIcon icon={faAlignLeft} /></div>
                              Artikel
                          </a>
                          </Link>

                      </div>
                  </div>
                  <div className="sb-sidenav-footer">
                      <div className="small">Login sebagai:</div>
                      {user && user.nama_admin}
                  </div>
              </nav>
          </div>
          <div id="layoutSidenav_content">
              <main>
                <main>{children}</main>      
              </main>
              <footer className="py-4 bg-light mt-auto">
                  <div className="container-fluid px-4">
                      <div className="d-flex align-items-center justify-content-between small">
                          <div className="text-muted">Copyright &copy; Sikatboss.co 2022</div>
                      </div>
                  </div>
              </footer>
          </div>
      </div>

    </>
  )
}