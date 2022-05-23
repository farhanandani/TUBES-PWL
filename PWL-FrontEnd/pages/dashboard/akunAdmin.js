import Layout from '../../components/dashboard/layout'
import {DataTable} from "simple-datatables"
import Head from "next/head";
import Script from 'next/script';

import { useEffect, useState, } from 'react'
import { useDispatch } from 'react-redux'
import Router from "next/router";
import Link from 'next/link'
import Image from 'next/image'

import { whoami } from '../../redux/actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


import $ from "jquery";

const formatRupiah = (money) => {
   return new Intl.NumberFormat('id-ID',
     { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }
   ).format(money);
}

export async function getServerSideProps(ctx) {
  const { req, res } = ctx
  const response = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/whoami", {     
    headers: {
      cookie: req.headers.cookie
    }
  });


  if(response.status != 401){
    const fetchAdmin = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/get_all_admin", {     
    headers: {
      cookie: req.headers.cookie
    }
  });
    
    const admin = await fetchAdmin.json();

    const data = await response.json();
    return {
    props: { data, admin },
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

const akunAdmin = ({data, admin}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(whoami(data));
    const dataTable = new DataTable("#daftarAdmin");
  }, [dispatch])

  const [namaAdmin, setNamaAdmin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();

  const [ubahNamaAdmin, setUbahNamaAdmin] = useState("");
  const [ubahPassword, setUbahPassword] = useState("");
  

  const onChangeNamaAdmin = (e) => {
    const namaAdmin = e.target.value;
    setNamaAdmin(namaAdmin);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const ubahOnChangeNamaAdmin = (e) => {
    const namaAdmin = e.target.value;
    setUbahNamaAdmin(namaAdmin);
  };

  const ubahOnChangePassword = (e) => {
    const password = e.target.value;
    setUbahPassword(password);
  };

  const tambah = (e) => {
    fetch(`https://sikatboss-backend.herokuapp.com/dashboard/register_admin`, {
      method: 'POST',
      credentials: 'include',
      body: `namaAdmin=${namaAdmin}&password=${password}`,
      headers: 
      {
          "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(async (response)=>{
      if(response.status == 400){
        const data = await response.json();
        setError(data.errors)
      }
      else if(response.status != 400){
        Router.reload(window.location.pathname)
      }

    })   
  }

  const ubah = async (e) => {
    var namaAdminUbah = document.getElementById("namaAdminUbah").innerText;
    
    var adminFilter = admin.filter(function (admin)
    {
      return admin.nama_admin == namaAdminUbah
    }
    );

    fetch(`https://sikatboss-backend.herokuapp.com/dashboard/update_admin/${adminFilter[0].id}`, {
      method: 'PUT',
      credentials: 'include',
      body: `namaAdmin=${ubahNamaAdmin}&password=${ubahPassword}`,
      headers: 
      {
          "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(async (response)=>{
      if(response.status == 400){
        const data = await response.json();
        setError(data.errors)
      }
      else if(response.status != 400){
        Router.reload(window.location.pathname)
      }

    })

  }

  const hapus = () => {
    var namaAdmin = document.getElementById("namaAdminHapus").innerText;
    fetch(`https://sikatboss-backend.herokuapp.com/dashboard/delete_admin/${namaAdmin}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then(()=>{
      Router.reload(window.location.pathname)
    })
  }

  return (
    <>
      <Layout>
      	<div className="container-fluid px-4">
          <h1 className="mt-4">Akun Admin</h1>
          <button type="button" className="btn btn-lg btn-success my-3" data-bs-toggle="modal" data-bs-target="#tambahAdmin">
            <FontAwesomeIcon icon={faPlus} /> Tambah Akun Admin
          </button>
          <div className="card mb-4">
            <div className="card-header">
                <i className="fas fa-table me-1"></i>
                Daftar Akun Admin
            </div>
            <div className="card-body">
              <div className="table-responsive">
              <table className="table" id="daftarAdmin">
                  <thead>
                      <tr>
                          <th>Nama Admin</th>
                          <th>Action</th>
                      </tr>
                  </thead>
                  <tfoot>
                      <tr>
                          <th>Nama Admin</th>
                          <th>Action</th>
                      </tr>
                  </tfoot>
                  <tbody>
                      { 
                        admin.map((admin, index)=>{
                          return (
                          <tr key={index}>
                            <td>{admin.nama_admin}</td>
                            <td>
                              <button type="button" className="btn btn-warning mt-2 me-2" data-bs-toggle="modal" data-bs-target="#ubah" 
                                data-bs-namaadmin={admin.nama_admin} >
                                Ubah
                              </button>
                              <button type="button" className="btn btn-danger mt-2" data-bs-toggle="modal" data-bs-target="#hapus" data-bs-namaadmin={admin.nama_admin}
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        )})
                      }
                  </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
      </Layout>

{/*modal tambah*/}
<div className="modal fade" id="tambahAdmin" tabIndex="-1" aria-labelledby="tambahAdminLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="tambahAdminLabel">Tambah Admin</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form>
          <div className="mb-3">
            <label htmlFor="namaAdmin" className="col-form-label">Nama Admin:</label>
            <input type="text" className="form-control" id="namaAdmin" value={namaAdmin} onChange={onChangeNamaAdmin} />
          </div>
          {error && (
            error.map((validate, index)=>{
              if(validate.namaAdmin){
                return <div className="" key={index}>
                  <div className="alert alert-danger" role="alert">
                    {validate.namaAdmin}
                  </div>
                </div>  
              }
            })

          )}
          <div className="mb-3">
            <label htmlFor="password" className="col-form-label">Password:</label>
            <input type="password" className="form-control" id="password" value={password} onChange={onChangePassword} />
          </div>
          {error && (
            error.map((validate, index)=>{
              if(validate.password){
                return <div className="" key={index}>
                  <div className="alert alert-danger" role="alert">
                    {validate.password}
                  </div>
                </div>  
              }
            })

          )}     
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
        <button type="button" className="btn btn-success" onClick={tambah}>Tambah</button>
      </div>
    </div>
  </div>
</div>


{/*modal ubah*/}
<div className="modal fade" id="ubah" tabIndex="-1" aria-labelledby="ubahLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="ubahLabel">Edit Akun Admin</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form>
          <div className="mb-3">
            <label htmlFor="ubahNamaAdmin" className="col-form-label">Nama Admin:</label>
            <input type="text" className="form-control" id="ubahNamaAdmin" value={ubahNamaAdmin} onChange={ubahOnChangeNamaAdmin} />
          </div>
          {error && (
            error.map((validate, index)=>{
              if(validate.namaAdmin){
                return <div className="" key={index}>
                  <div className="alert alert-danger" role="alert">
                    {validate.namaAdmin}
                  </div>
                </div>  
              }
            })

          )}
          <div className="mb-3">
            <label htmlFor="ubahPassword" className="col-form-label">Password <strong>(Kosongkan Jika tidak ingin merubah Password)</strong>:</label>
            <input type="password" className="form-control" id="ubahPassword" value={ubahPassword} onChange={ubahOnChangePassword} />
          </div>    
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
        <button type="button" className="btn btn-warning" onClick={ubah}>Ubah</button>
      </div>
    </div>
  </div>
</div>

{/*modal hapus*/}
<div className="modal fade" id="hapus" tabIndex="-1" aria-labelledby="hapusLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="hapusLabel">Hapus Admin</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
        <button id="button-hapus" type="button" className="btn btn-danger" onClick={hapus}>Hapus</button>
      </div>
    </div>
  </div>
</div>

      <Script id="hapusLayanan" strategy="afterInteractive">
        {
         `
            var hapusAdmin = document.getElementById('hapus')
            hapusAdmin.addEventListener('show.bs.modal', function (event) {
              // Button that triggered the modal
              var button = event.relatedTarget
              // Extract info from data-bs-* attributes
              var namaAdmin = button.getAttribute('data-bs-namaadmin')
              
              // Update the modal's content.
              var modalBody = hapusAdmin.querySelector('.modal-body')

              modalBody.innerHTML  = '<p id="text-hapus">Apakah anda yakin ingin menghapus Admin dengan nama: ' + '<strong>' + '<span id="namaAdminHapus">' + namaAdmin + '</span>' + '</strong>' + '?' +'</p>' 
            })

            var ubah = document.getElementById('ubah')
              ubah.addEventListener('show.bs.modal', function (event) {
                // Button that triggered the modal
                var button = event.relatedTarget
                // Extract info from data-bs-* attributes
                var namaAdmin = button.getAttribute('data-bs-namaadmin')
      

                // Update the modal's content.
                var modalTitle = ubah.querySelector('.modal-title')
                

                modalTitle.innerHTML = 'Edit Admin: ' + '<span id="namaAdminUbah">' + namaAdmin + '</span>'
                
              })
        ` 
        }
      </Script>
    </>
  )
}

export default akunAdmin