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
import NumberFormat from 'react-number-format';

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
    const fetchLayanan = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/get_all_layanan", {     
    headers: {
      cookie: req.headers.cookie
    }
  });
    
    const layanan = await fetchLayanan.json();

    const fetchKategori = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/get_all_kategori", {     
      headers: {
        cookie: req.headers.cookie
      }
    });
    
    const kategori = await fetchKategori.json();

    const data = await response.json();
    return {
    props: { data, layanan, kategori },
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

const daftarLayanan = ({data, layanan, kategori}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(whoami(data));
    const dataTable = new DataTable("#daftarLayanan");
    setNamaKategori("Deep Clean")
    setUbahNamaKategori("Deep Clean")
  }, [dispatch])

  const [namaLayanan, setNamaLayanan] = useState("");
  const [namaKategori, setNamaKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [harga, setHarga] = useState("");
  const [error, setError] = useState();

  const [ubahNamaLayanan, setUbahNamaLayanan] = useState("");
  const [ubahNamaKategori, setUbahNamaKategori] = useState("");
  const [ubahDeskripsi, setUbahDeskripsi] = useState("");
  const [ubahHarga, setUbahHarga] = useState("");
  

  const onChangeNamaLayanan = (e) => {
    const namaLayanan = e.target.value;
    setNamaLayanan(namaLayanan);
  };

  const onChangeNamaKategori = (e) => {
    const namaKategori = e.target.value;
    setNamaKategori(namaKategori);
  };
  const onChangeDeskripsi = (e) => {
    const deskripsi = e.target.value;
    setDeskripsi(deskripsi);
  };

  const ubahOnChangeNamaLayanan = (e) => {
    const namaLayanan = e.target.value;
    setUbahNamaLayanan(namaLayanan);
  };

  const ubahOnChangeNamaKategori = (e) => {
    const namaKategori = e.target.value;
    setUbahNamaKategori(namaKategori);
  };
  const ubahOnChangeDeskripsi = (e) => {
    const deskripsi = e.target.value;
    setUbahDeskripsi(deskripsi);
  };

  const tambah = (e) => {
    fetch(`https://sikatboss-backend.herokuapp.com/dashboard/tambah_layanan`, {
      method: 'POST',
      credentials: 'include',
      body: `namaLayanan=${namaLayanan}&namaKategori=${namaKategori}&deskripsi=${deskripsi}&harga=${harga}`,
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
    var namaLayanan = document.getElementById("ubahNamaLayanan").innerText;
    fetch(`https://sikatboss-backend.herokuapp.com/dashboard/update_layanan/${namaLayanan}`, {
      method: 'PUT',
      credentials: 'include',
      body: `namaLayanan=${ubahNamaLayanan}&namaKategori=${ubahNamaKategori}&deskripsi=${ubahDeskripsi}&harga=${ubahHarga}`,
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
    var idLayanan = document.getElementById("idLayanan").innerText;
    fetch(`https://sikatboss-backend.herokuapp.com/dashboard/delete_layanan/${idLayanan}`, {
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
          <h1 className="mt-4">Daftar Layanan</h1>
          <button type="button" className="btn btn-lg btn-success my-3" data-bs-toggle="modal" data-bs-target="#tambahLayanan">
            <FontAwesomeIcon icon={faPlus} /> Tambah Layanan
          </button>
          <div className="card mb-4">
            <div className="card-header">
                <i className="fas fa-table me-1"></i>
                Daftar Layanan
            </div>
            <div className="card-body">
              <div className="table-responsive">
              <table className="table" id="daftarLayanan">
                  <thead>
                      <tr>
                          <th>Nama Layanan</th>
                          <th>Nama Kategori</th>
                          <th>Deskripsi</th>
                          <th>Harga</th>
                          <th>Action</th>
                      </tr>
                  </thead>
                  <tfoot>
                      <tr>
                          <th>Nama Layanan</th>
                          <th>Nama Kategori</th>
                          <th>Deskripsi</th>
                          <th>Harga</th>
                          <th>Action</th>
                      </tr>
                  </tfoot>
                  <tbody>
                      { 
                        layanan.map((layanan, index)=>{
                          return (
                          <tr key={index}>
                            <td>{layanan.nama_layanan}</td>
                            <td>{layanan.nama_kategori}</td>
                            <td>{layanan.deskripsi}</td>
                            <td>{formatRupiah(layanan.harga)}</td>
                            <td>
                              <button type="button" className="btn btn-warning mt-2 me-2" data-bs-toggle="modal" data-bs-target="#ubah" 
                                data-bs-namalayanan={layanan.nama_layanan} >
                                Ubah
                              </button>
                              <button type="button" className="btn btn-danger mt-2" data-bs-toggle="modal" data-bs-target="#hapus" data-bs-namalayanan={layanan.nama_layanan} 
                                data-bs-idlayanan={layanan.id}
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
<div className="modal fade" id="tambahLayanan" tabIndex="-1" aria-labelledby="tambahLayananLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="tambahLayananLabel">Tambah Layanan</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form>
          <div className="mb-3">
            <label htmlFor="namaKategoriLayanan" className="col-form-label">Nama Layanan:</label>
            <input type="text" className="form-control" id="namaKategoriLayanan" value={namaLayanan} onChange={onChangeNamaLayanan} />
          </div>
          {error && (
            error.map((validate, index)=>{
              if(validate.namaLayanan){
                return <div className="" key={index}>
                  <div className="alert alert-danger" role="alert">
                    {validate.namaLayanan}
                  </div>
                </div>  
              }
            })

          )}
          <div className="mb-3">
            <label htmlFor="namaKategori" className="col-form-label">Kategori :</label>
            <select className="form-select" aria-label="Default select example" id="namaKategori" onChange={onChangeNamaKategori}>
              {kategori.map((kategori, index)=>{
                  return <option value={kategori.nama_kategori} key={index}>{kategori.nama_kategori}</option>
                })
              }
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="deskripsi" className="col-form-label">Deskripsi:</label>
            <textarea className="form-control" id="deskripsi" value={deskripsi} onChange={onChangeDeskripsi}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="harga" className="col-form-label">Harga:</label>
            <NumberFormat
              className="form-control" id="harga"
              value={harga}
              thousandSeparator={true}
              prefix={'RP. '}
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                // formattedValue = $2,223
                // value ie, 2223
                setHarga(value);
              }}
            />
          </div>
          {error && (
              error.map((validate, index)=>{
                if(validate.harga){
                  return <div className="" key={index}>
                    <div className="alert alert-danger" role="alert">
                      {validate.harga}
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
        <h5 className="modal-title" id="ubahLabel">Ubah Layanan</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form>
          <div className="mb-3">
            <label htmlFor="ubahNamaLayanan" className="col-form-label">Nama Layanan:</label>
            <input type="text" className="form-control" id="ubahNamaLayanan" value={ubahNamaLayanan} onChange={ubahOnChangeNamaLayanan} />
          </div>
          {error && (
            error.map((validate, index)=>{
              if(validate.namaLayanan){
                return <div className="" key={index}>
                  <div className="alert alert-danger" role="alert">
                    {validate.namaLayanan}
                  </div>
                </div>  
              }
            })

          )}
          <div className="mb-3">
            <label htmlFor="ubahNamaKategori" className="col-form-label">Kategori :</label>
            <select className="form-select" aria-label="Default select example" id="ubahNamaKategori" onChange={ubahOnChangeNamaKategori}>
              {kategori.map((kategori, index)=>{
                  return <option value={kategori.nama_kategori} key={index}>{kategori.nama_kategori}</option>
                })
              }
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="ubahDeskripsi" className="col-form-label">Deskripsi:</label>
            <textarea className="form-control" id="ubahDeskripsi" value={ubahDeskripsi} onChange={ubahOnChangeDeskripsi}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="ubahHarga" className="col-form-label">Harga:</label>
            <NumberFormat
              className="form-control" id="ubahHarga"
              value={ubahHarga}
              thousandSeparator={true}
              prefix={'RP. '}
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                // formattedValue = $2,223
                // value ie, 2223
                setUbahHarga(value);
              }}
            />
          </div>
          {error && (
              error.map((validate, index)=>{
                if(validate.harga){
                  return <div className="" key={index}>
                    <div className="alert alert-danger" role="alert">
                      {validate.harga}
                    </div>
                  </div>  
                }
              })

            )}
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
        <h5 className="modal-title" id="hapusLabel">Hapus Layanan</h5>
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
            var hapusLayanan = document.getElementById('hapus')
            hapusLayanan.addEventListener('show.bs.modal', function (event) {
              // Button that triggered the modal
              var button = event.relatedTarget
              // Extract info from data-bs-* attributes
              var namaLayanan = button.getAttribute('data-bs-namalayanan')
              var idLayanan = button.getAttribute('data-bs-idlayanan')
              
              // Update the modal's content.
              var modalBody = hapusLayanan.querySelector('.modal-body')
              var buttonHapus = hapusLayanan.querySelector('#button-hapus')

              modalBody.innerHTML  = '<p id="text-hapus">Apakah anda yakin ingin menghapus Layanan dengan nama: ' + '<strong>' + '<span>' + namaLayanan + '</span>' + '</strong>' + '?' +'</p>' + '<span class="d-none" id="idLayanan">' + idLayanan + '</span>' 
            })

            var ubah = document.getElementById('ubah')
              ubah.addEventListener('show.bs.modal', function (event) {
                // Button that triggered the modal
                var button = event.relatedTarget
                // Extract info from data-bs-* attributes
                var namaLayanan = button.getAttribute('data-bs-namalayanan')

                // Update the modal's content.
                var modalTitle = ubah.querySelector('.modal-title')
                

                modalTitle.innerHTML = 'Ubah Layanan: ' + '<span id="ubahNamaLayanan">' + namaLayanan + '</span>'
                
              })
        ` 
        }
      </Script>
    </>
  )
}

export default daftarLayanan