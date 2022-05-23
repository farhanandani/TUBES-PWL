import axios from "axios";

const API_URL = "https://sikatboss-backend.herokuapp.com/";

const register = (emailCustomer, namaCustomer, noTelepon, password) => {
  return axios.post(API_URL + "customer/register_customer", {
    emailCustomer,
    namaCustomer,
    noTelepon,
    password,
  });
};

const login = (emailCustomer, password) => {
  return axios
    .post(API_URL + "auth/login_costumer", {
      emailCustomer,
      password,
    }, 
    { withCredentials: true })
    .then((response) => {
      return response.data;
    });
};

const logout = () => {
  return axios.get(API_URL + "customer/logout", 
    { withCredentials: true })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
};

//---------------------------------Admin--------------------------------------------------------------

const loginAdmin = (namaAdmin, password) => {
  return axios
    .post(API_URL + "auth/login_admin", {
      namaAdmin,
      password
    }, 
    { withCredentials: true })
    .then((response) => {
      return response.data;
    });
};

const logoutAdmin = () => {
  return axios.get(API_URL + "dashboard/logout", 
    { withCredentials: true })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
};

export default {
  register,
  login,
  logout,
  loginAdmin,
  logoutAdmin
};