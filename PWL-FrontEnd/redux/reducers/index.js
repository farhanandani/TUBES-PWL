import { combineReducers } from 'redux'
import {counterReducer, timerReducer} from "./timeAndCounter";
import auth from "./auth";
import message from "./message";

// COMBINED REDUCERS
const reducers = {
  counter: counterReducer,
  timer: timerReducer,
  auth,
  message,
}

export default combineReducers(reducers)