import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from 'next/link'

import { whoami } from "../redux/actions/auth";
import { updateCustomer } from "../redux/actions/customer";
import { clearMessage } from "../redux/actions/message";
import Layout from '../components/layout'

// import style from '../styles/loginAndRegister.module.css';
import Input from 'react-phone-number-input/input';
import Swal from 'sweetalert2';

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

const Profil = ({data}) => {

  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");
  const [nama, setNama] = useState("");
  const [noTelepon, setnoTelepon] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useSelector(state => state.auth);
  const { message } = useSelector(state => state.message);
  const dispatch = useDispatch();

  const router = useRouter();

  useEffect( () => {
    dispatch(clearMessage());
    dispatch(whoami(data));
    setEmail(data.email_customer)
    setNama(data.nama_customer)
    setAlamat(data.alamat)
    setnoTelepon(data.no_telepon)
    return () => {
      dispatch(clearMessage());
    }
  }, [dispatch])

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };
  const onChangeNama = (e) => {
    const nama = e.target.value;
    setNama(nama);
  };
  const onChangeNoTelepon = (e) => {
    const noTelepon = e.target.value;
    setnoTelepon(noTelepon);
  };
  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };
  const onChangeAlamat = (e) => {
    const alamat = e.target.value;
    setAlamat(alamat);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(clearMessage());
    setLoading(true);
      dispatch(updateCustomer(data.id, nama, email, noTelepon, alamat, password))
        .then((data) => {
          dispatch(clearMessage());
          router.push('/profil')
          setLoading(false);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Profil Berhasil di Ubah',
            showConfirmButton: true,
            timer: 5000
          })
        })
        .catch((error) => {
          setLoading(false);
        });
  };
  
  return (
    <Layout>
      <div className="container py-5">
          <h1 className="text-center">Edit Profile</h1>
          <hr/>
        <div className="row">
            <div className="col-md-12 personal-info">
              <h3>Personal info</h3>
              
              <form autoComplete="off" onSubmit={handleUpdate}>
                <div className="form-group pt-4 pb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    id="email"
                    type="text"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={onChangeEmail}
                  />
                </div>
                {message && (
                  message.map((validate, index)=>{
                    if(validate.emailCustomer){
                      return <div className="" key={index}>
                        <div className="alert alert-danger" role="alert">
                          {validate.emailCustomer}
                        </div>
                      </div>  
                    }
                  })
                  
                )}
                <div className="form-group pb-3">
                  <label htmlFor="nama" className="form-label">Nama Lengkap</label>
                  <input
                    id="nama"
                    type="text"
                    className="form-control"
                    name="nama"
                    value={nama}
                    onChange={onChangeNama}
                  />
                </div>
                {message && (
                  message.map((validate, index)=>{
                    if(validate.namaCustomer){
                      return <div className="" key={index}>
                        <div className="alert alert-danger" role="alert">
                          {validate.namaCustomer}
                        </div>
                      </div>  
                    }
                  })
                  
                )}
                <div className="form-group pb-3">
                  <label htmlFor="noTelepon" className="form-label">No Telepon</label>
                  <div className="input-group">
                  <span className="input-group-text" id="basic-addon1">+62</span>
                    <Input
                      className="form-control"
                      id="noTelepon"
                      aria-label="noTelepon"
                      aria-describedby="basic-addon1"
                      country="ID"
                      withCountryCallingCode
                      value={noTelepon}
                      onChange={setnoTelepon}
                    />
                  </div>
                </div>
                {message && (
                  message.map((validate, index)=>{
                    if(validate.noTelepon){
                      return <div className="" key={index}>
                        <div className="alert alert-danger" role="alert">
                          {validate.noTelepon}
                        </div>
                      </div>  
                    }
                  })

                )}
                <div className="form-group pb-3">
                    <label htmlFor="password" className="form-label">Alamat</label>
                    <input
                      id="alamat"
                      type="alamat"
                      className="form-control"
                      name="alamat"
                      value={alamat}
                      onChange={onChangeAlamat}
                    />
                </div>
                {message && (
                  message.map((validate, index)=>{
                    if(validate.password){
                      return <div className="" key={index}>
                        <div className="alert alert-danger" role="alert">
                          {validate.password}
                        </div>
                      </div>  
                    }
                  })

                )}
                <div className="form-group pb-3">
                    <label htmlFor="password" className="form-label">Password <strong>(Kosongkan jika tidak ingin merubah password)</strong></label>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      name="password"
                      value={password}
                      onChange={onChangePassword}
                    />
                </div>
                {message && (
                  message.map((validate, index)=>{
                    if(validate.password){
                      return <div className="" key={index}>
                        <div className="alert alert-danger" role="alert">
                          {validate.password}
                        </div>
                      </div>  
                    }
                  })

                )}
                <div className="d-grid col-3 mx-auto">
                  <button className="btn btn-dark btn-lg btn-block" disabled={loading}>
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
                </form>
            </div>
        </div>
      </div>
      <hr/>
    </Layout>
  );
  
  
};
export default Profil;