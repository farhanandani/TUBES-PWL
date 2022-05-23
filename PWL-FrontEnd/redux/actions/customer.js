import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
} from "../types";
import customerService  from "../../services/customer.service";

export const updateCustomer = (idCustomer, namaCustomer, emailCustomer, noTelepon, alamat, password) => (dispatch) => {
  return customerService.updateProfil(idCustomer, namaCustomer, emailCustomer, noTelepon, alamat, password).then(
    (response) => {
      dispatch({
        type: SET_MESSAGE,
        payload: response.data,
      });
      return Promise.resolve(response.data);
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({
        type: SET_MESSAGE,
        payload: error.response.data.errors,
      });
      return Promise.reject(error.response.data.errors);
    }
  );
};



