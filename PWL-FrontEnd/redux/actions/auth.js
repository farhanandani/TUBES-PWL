import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
} from "../types";
import AuthService from "../../services/auth.service";
export const register = (emailCustomer, namaCustomer, noTelepon, password) => (dispatch) => {
  return AuthService.register(emailCustomer, namaCustomer, noTelepon, password).then(
    (response) => {
      dispatch({
        type: REGISTER_SUCCESS,
      });
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
        type: REGISTER_FAIL,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: error.response.data.errors,
      });
      return Promise.reject(error.response.data.errors);
    }
  );
};

export const login = (emailCustomer, password) => (dispatch) => {
  return AuthService.login(emailCustomer, password).then(
    (data) => {
      if(data.message == 'Email atau Password Salah'){
        dispatch({
        type: LOGIN_FAIL,
        });
        dispatch({
          type: SET_MESSAGE,
          payload: data.message,
        });
      };
      if(data.message == 'Log in Berhasil'){
        dispatch({
          type: LOGIN_SUCCESS,
          payload: data.message,
        });
      };
      
      return Promise.resolve(data.token);
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: error.response.data.message,
      });
      return Promise.reject();
    }
  );
};
export const logout = () => (dispatch) => {
  AuthService.logout();
  dispatch({
    type: LOGOUT,
  });
};

export const whoami = (dataUser) => (dispatch) => {
  if(!dataUser){
    dispatch({
      type: LOGIN_FAIL,
    });
  }
  if (dataUser) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: dataUser,
    });
  }
};

//-----------------------------Admin----------------------------------------------

export const loginAdmin = (namaAdmin, password) => (dispatch) => {
  return AuthService.loginAdmin(namaAdmin, password).then(
    (data) => {
      if(data.message == 'Username atau Password Salah'){
        dispatch({
        type: LOGIN_FAIL,
        });
        dispatch({
          type: SET_MESSAGE,
          payload: data.message,
        });
      };
      if(data.message == 'Log in Berhasil'){
        dispatch({
          type: LOGIN_SUCCESS,
          payload: data.message,
        });
      };
      
      return Promise.resolve(data.token);
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: error.response.data.message,
      });
      return Promise.reject();
    }
  );
};

export const logoutAdmin = () => (dispatch) => {
  AuthService.logoutAdmin();
  dispatch({
    type: LOGOUT,
  });
};