import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from 'next/link'

import { register } from "../redux/actions/auth";
import { clearMessage } from "../redux/actions/message";
import Layout from '../components/layout'

import style from '../styles/loginAndRegister.module.css';
import Input from 'react-phone-number-input/input';

export async function getServerSideProps(ctx) {
  const { req, res } = ctx
  const response = await fetch("https://sikatboss-backend.herokuapp.com/customer/whoami", {     
    headers: {
      cookie: req.headers.cookie
    }
  });
  if(response.status != 401){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  else if(response.status == 401){
    return {
    props: { },
    };
  }  
}

const Register = () => {

  const [email, setEmail] = useState("");
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
  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(clearMessage());
    setLoading(true);
      dispatch(register(email, nama, noTelepon, password))
        .then((data) => {
          dispatch(clearMessage());
          router.push('/afterRegister')
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
  };
  
  return (
    <Layout>
      <div className="container">
          <div className={`row justify-content-center align-items-center ${style.container2}`}>
              <div className="col-12 col-md-6 col-sm-12">
                  <div className="card p-5">
                      <div className="card-body">
                          <h1 className="card-title text-center">Register</h1>
                          <form autoComplete="off" onSubmit={handleRegister}>
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
                                  <label htmlFor="password" className="form-label">Password</label>
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
                              <div className="d-grid col-12 mx-auto">
                                <button className="btn btn-dark btn-lg btn-block" disabled={loading}>
                                  {loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                  )}
                                  <span>Register</span>
                                </button>
                              </div>
                              <p className="text-center mt-4">
                                Sudah punya Akun?
                                <Link href="/login"> 
                                  <button type="button" className="btn btn-link p-0" onClick={(e) => {dispatch(clearMessage())}}>
                                    Login
                                  </button> 
                                </Link>
                              </p>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </Layout>
  );
  
  
};
export default Register;