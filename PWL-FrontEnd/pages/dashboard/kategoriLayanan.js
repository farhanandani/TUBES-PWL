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
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';

import $ from "jquery";

export async function getServerSideProps(ctx) {
  const { req, res } = ctx
  const response = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/whoami", {     
    headers: {
      cookie: req.headers.cookie
    }
  });


  if(response.status != 401){
    const fetchKategori = await fetch("https://sikatboss-backend.herokuapp.com/dashboard/get_all_kategori", {     
    headers: {
      cookie: req.headers.cookie
    }
  });
    
    const kategori = await fetchKategori.json();
    const data = await response.json();
    return {
    props: { data, kategori },
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

const kategoriLayanan = ({data, kategori}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(whoami(data));
    const dataTable = new DataTable("#kategori");
  }, [dispatch])

  const [namaKategori, setNamaKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [selectedImage, setSelectedImage] = useState();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const [ubahNamaKategori, setUbahNamaKategori] = useState("");
  const [ubahDeskripsi, setUbahDeskripsi] = useState("");
  const [ubahSelectedImage, setUbahSelectedImage] = useState();

  const onChangeNamaKategori = (e) => {
    const namaKategori = e.target.value;
    setNamaKategori(namaKategori);
  };
  const onChangeDeskripsi = (e) => {
    const deskripsi = e.target.value;
    setDeskripsi(deskripsi);
  };

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const ubahOnChangeNamaKategori = (e) => {
    const namaKategori = e.target.value;
    setUbahNamaKategori(namaKategori);
  };
  const ubahOnChangeDeskripsi = (e) => {
    const deskripsi = e.target.value;
    setUbahDeskripsi(deskripsi);
  };

  const ubahImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUbahSelectedImage(e.target.files[0]);
    }
  };

  const tambah = (e) => {
    fetch(`https://sikatboss-backend.herokuapp.com/dashboard/tambah_kategori`, {
      method: 'POST',
      credentials: 'include',
      body: `namaKategori=${namaKategori}&deskripsi=${deskripsi}&urlGambar=${url}`,
      headers: 
      {
          "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(async (response)=>{
      if(response.status == 400){
        const data = await response.json();
        setError(data.errors[0].namaKategori)
      }
      else if(response.status != 400){
        const data = new FormData()
        data.append("file", selectedImage)
        data.append("upload_preset", "pti06_preset")
        data.append("cloud_name","dkqxlkrj5")
        await fetch("https://api.cloudinary.com/v1_1/dkqxlkrj5/image/upload",{
          method:"post",
          body: data
        })
        .then(resp => resp.json())
        .then(hasil => {
          fetch(`https://sikatboss-backend.herokuapp.com/dashboard/update_kategori/${namaKategori}`, {
            method: 'PUT',
            credentials: 'include',
            body: `namaKategori=${namaKategori}&deskripsi=${deskripsi}&urlGambar=${hasil.url}`,
            headers: 
            {
                "Content-Type": "application/x-www-form-urlencoded"
            }
          })
        })
        .catch(err => console.log(err))
        Router.reload(window.location.pathname)

      }

    })    
  }

  const ubahKategori = async (e) => {
    var idKategori = document.getElementById("ubahIdKategori").innerText;
    if(!ubahSelectedImage){
      fetch(`https://sikatboss-backend.herokuapp.com/dashboard/get_kategori_by_id/${idKategori}`, {
        method: 'GET',
        credentials: 'include',
      })
      .then(async (data)=>{
        const hasil = await data.json() 
        await fetch(`https://sikatboss-backend.herokuapp.com/dashboard/update_kategori/${idKategori}`, {
          method: 'PUT',
          credentials: 'include',
          body: `namaKategori=${ubahNamaKategori}&deskripsi=${ubahDeskripsi}&urlGambar=${hasil.url_gambar}`,
          headers: 
          {
              "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(async (response)=>{
          if(response.status == 400){
            const data = await response.json();
            setError(data.errors[0].namaKategori)
          }
          else{
            Router.reload(window.location.pathname)

          }
        })
      })
      
      
    }
    else{
      const data = new FormData()
      data.append("file", ubahSelectedImage)
      data.append("upload_preset", "pti06_preset")
      data.append("cloud_name","dkqxlkrj5")
      await fetch("https://api.cloudinary.com/v1_1/dkqxlkrj5/image/upload",{
        method:"post",
        body: data
      })
      .then(resp => resp.json())
      .then(async hasil => {
        await fetch(`https://sikatboss-backend.herokuapp.com/dashboard/update_kategori/${idKategori}`, {
          method: 'PUT',
          credentials: 'include',
          body: `namaKategori=${ubahNamaKategori}&deskripsi=${ubahDeskripsi}&urlGambar=${hasil.url}`,
          headers: 
          {
              "Content-Type": "application/x-www-form-urlencoded"
          }
        }).catch(err => console.log(err))
      })
      .catch(err => console.log(err))
      await Router.reload(window.location.pathname)
    }

  }

  const hapusKategori = () => {
    var idKategori = document.getElementById("idKategori").innerText;
    fetch(`https://sikatboss-backend.herokuapp.com/dashboard/delete_kategori/${idKategori}`, {
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
          <h1 className="mt-4">Kategori Layanan</h1>
          <button type="button" className="btn btn-lg btn-success my-3" data-bs-toggle="modal" data-bs-target="#tambahKategori">
            <FontAwesomeIcon icon={faPlus} /> Tambah Kategori Layanan
          </button>
          <div className="card mb-4">
            <div className="card-header">
                <i className="fas fa-table me-1"></i>
                Daftar Kategori Layanan
            </div>
            <div className="card-body">
              <div className="table-responsive">
              <table className="table" id="kategori">
                  <thead>
                      <tr>
                          <th>Nama Kategori</th>
                          <th>Gambar</th>
                          <th>Deskripsi</th>
                          <th>Action</th>
                      </tr>
                  </thead>
                  <tfoot>
                      <tr>
                          <th>Nama Kategori</th>
                          <th>Gambar</th>
                          <th>Deskripsi</th>
                          <th>Action</th>
                      </tr>
                  </tfoot>
                  <tbody>
                      { 
                        kategori.map((kategori, index)=>{
                          return (
                          <tr key={index}>
                            <td>{kategori.nama_kategori}</td>
                            <td><img src={kategori.url_gambar} className="img-fluid" alt="gambar"/></td>
                            <td>{kategori.deskripsi}</td>
                            <td>
                              <button type="button" className="btn btn-warning mt-2" data-bs-toggle="modal" data-bs-target="#ubahKategori" 
                                data-bs-idkategori={kategori.nama_kategori} data-bs-deskripsi={kategori.deskripsi} >
                                Ubah
                              </button>
                              <button type="button" className="btn btn-danger mt-2" data-bs-toggle="modal" data-bs-target="#hapusKategori" data-bs-idkategori={kategori.nama_kategori}>
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
<div className="modal fade" id="tambahKategori" tabIndex="-1" aria-labelledby="tambahKategoriLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="tambahKategoriLabel">Tambah Kategori Layanan</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form>
          <div className="mb-3">
            <label htmlFor="namaKategoriLayanan" className="col-form-label">Nama Kategori Layanan:</label>
            <input type="text" className="form-control" id="namaKategoriLayanan" value={namaKategori} onChange={onChangeNamaKategori} />
          </div>
          {error && (
            <div className="">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="deskripsi" className="col-form-label">Deskripsi:</label>
            <textarea className="form-control" id="deskripsi" value={deskripsi} onChange={onChangeDeskripsi}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="gambarKategoriLayanan" className="form-label">Gambar:</label>
            <input className="form-control" type="file" id="gambarKategoriLayanan" accept="image/*" onChange={imageChange} />
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="gambar"
                className="img-fluid"
              />
            )}
          </div>
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
<div className="modal fade" id="ubahKategori" tabIndex="-1" aria-labelledby="ubahKategoriLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="ubahKategoriLabel">Ubah Kategori Layanan</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form>
          <div className="mb-3">
            <label htmlFor="ubahNamaKategoriLayanan" className="col-form-label">Nama Kategori Layanan:</label>
            <input type="text" className="form-control" value={ubahNamaKategori} id="ubahNamaKategoriLayanan" onChange={ubahOnChangeNamaKategori} />
          </div>
          {error && (
            <div className="">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="ubahDeskripsi" className="col-form-label">Deskripsi:</label>
            <textarea className="form-control" value={ubahDeskripsi} id="ubahDeskripsi" onChange={ubahOnChangeDeskripsi}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="ubahGambarKategoriLayanan" className="form-label">Gambar:</label>
            <input className="form-control" type="file" id="ubahGambarKategoriLayanan" accept="image/*" onChange={ubahImageChange} />
            {ubahSelectedImage && (
              <img
                src={URL.createObjectURL(ubahSelectedImage)}
                alt="gambar"
                className="img-fluid"
              />
            )}
          </div>
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
        <button type="button" className="btn btn-warning" onClick={ubahKategori}>Ubah</button>
      </div>
    </div>
  </div>
</div>

{/*modal hapus*/}
<div className="modal fade" id="hapusKategori" tabIndex="-1" aria-labelledby="hapusKategoriLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="hapusKategoriLabel">Hapus Kategori Layanan</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
        <button id="button-hapus" type="button" className="btn btn-danger" onClick={hapusKategori}>Hapus</button>
      </div>
    </div>
  </div>
</div>

      <Script id="hapusKategori" strategy="afterInteractive">
        {
         `
            var hapusKategori = document.getElementById('hapusKategori')
            hapusKategori.addEventListener('show.bs.modal', function (event) {
              // Button that triggered the modal
              var button = event.relatedTarget
              // Extract info from data-bs-* attributes
              var idKategori = button.getAttribute('data-bs-idkategori')
              
              // Update the modal's content.
              var modalBody = hapusKategori.querySelector('.modal-body')
              var buttonHapus = hapusKategori.querySelector('#button-hapus')

              modalBody.innerHTML  = '<p id="text-hapus">Apakah anda yakin ingin menghapus Kategori Layanan dengan nama Kategori: ' + '<strong>' + '<span id="idKategori">' + idKategori + '</span>' + '</strong>' + '?' +'</p>' 
            })

            var ubahKategori = document.getElementById('ubahKategori')
              ubahKategori.addEventListener('show.bs.modal', function (event) {
                // Button that triggered the modal
                var button = event.relatedTarget
                // Extract info from data-bs-* attributes
                var idKategori = button.getAttribute('data-bs-idkategori')
                var deskripsi = button.getAttribute('data-bs-deskripsi')

                // Update the modal's content.
                var modalTitle = ubahKategori.querySelector('.modal-title')
                var namaInput = ubahKategori.querySelector('#ubahNamaKategoriLayanan')
                var deskripsiInput = ubahKategori.querySelector('#ubahDeskripsi')

                modalTitle.innerHTML = 'Ubah Kategori Layanan: ' + '<span id="ubahIdKategori">' + idKategori + '</span>'
                // namaInput.value = idKategori
                // deskripsiInput.value = deskripsi
              })
        ` 
        }
      </Script>
    </>
  )
}

export default kategoriLayanan