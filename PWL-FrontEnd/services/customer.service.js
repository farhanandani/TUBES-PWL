import axios from "axios";

const API_URL = "https://sikatboss-backend.herokuapp.com/customer";

const getAllArtikel = () => {
  return axios.get(API_URL + "/get_all_artikel");
};
const getArtikelByid = (id) => {
  return axios.get(API_URL + `/get_artikel_by_id/${id}`);
};
const getAllKategori = () => {
  return axios.get(API_URL + "/get_all_kategori");
};
const getKategoriByid = (idKategori) => {
  return axios.get(API_URL + `/get_kategori_by_id/${idKategori}`);
};
const getAllLayanan = () => {
  return axios.get(API_URL + "/get_all_layanan");
};
const getLayananByid = (idLayanan) => {
  return axios.get(API_URL + `/get_layanan_by_id/${idLayanan}`);
};

const updateProfil = (idCustomer, namaCustomer, emailCustomer, noTelepon, alamat, password) => {
  return axios.put(API_URL + `/update_customer/${idCustomer}`, {
    emailCustomer,
    namaCustomer,
    noTelepon,
    alamat,
    password,
  },{ withCredentials: true });
};



export default {
  getAllArtikel,
  getArtikelByid,
  getAllKategori,
  getKategoriByid,
  getAllLayanan,
  getLayananByid,
  updateProfil
};