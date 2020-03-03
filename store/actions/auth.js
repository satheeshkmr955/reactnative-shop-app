import axios from "axios";
import moment from "moment";
import { AsyncStorage } from "react-native";

const authInstance = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1/accounts"
});

authInstance.interceptors.request.use(config => {
  config.url =
    ":" + config.url + "?key=AIzaSyDAsuAwSTg6vAhBSe1a57OfaiZVsIx2Z2Q";
  return config;
});

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

let timer;

export const authenticate = ({ userId, token, expiryTime }) => {
  return dispatch => {
    dispatch(setLogOutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId, token });
  };
};

export const signup = (email, password) => {
  const payload = { email, password, returnSecureToken: true };
  return async dispatch => {
    try {
      const response = await authInstance.post("signUp", payload);
      const authDetails = response.data;
      // console.log(authDetails, authDetails);
      const { idToken: token, localId: userId, expiresIn } = authDetails;
      const expiryTime = parseInt(expiresIn) * 1000;
      dispatch(authenticate({ token, userId, expiryTime }));
      const expiryDate = moment()
        .add(parseInt(expiresIn), "seconds")
        .toISOString();
      saveAuthDataToStorage(token, userId, expiryDate);
    } catch (err) {
      const errObj = err.response.data;
      console.log(errObj);
      let message = errObj.error.message;
      if (errObj.error.message === "EMAIL_EXISTS") {
        message = "Email already exists";
      }
      throw new Error(message);
    }
  };
};

export const login = (email, password) => {
  const payload = { email, password, returnSecureToken: true };
  return async dispatch => {
    try {
      const response = await authInstance.post("signInWithPassword", payload);
      const authDetails = response.data;
      // console.log(authDetails, authDetails);
      const { idToken: token, localId: userId, expiresIn } = authDetails;
      const expiryTime = parseInt(expiresIn) * 1000;
      dispatch(authenticate({ token, userId, expiryTime }));
      const expiryDate = moment()
        .add(parseInt(expiresIn), "seconds")
        .toISOString();
      saveAuthDataToStorage(token, userId, expiryDate);
    } catch (err) {
      const errObj = err.response.data;
      console.log(errObj);
      let message = errObj.error.message;
      if (errObj.error.message === "EMAIL_NOT_FOUND") {
        message = "Entered email id is not found";
      }
      if (errObj.error.message === "INVALID_PASSWORD") {
        message = "Entered password is invalid";
      }
      throw new Error(message);
    }
  };
};

export const logout = () => {
  clearLogOutTimer();
  AsyncStorage.removeItem("authData");
  return { type: LOGOUT };
};

const clearLogOutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogOutTimer = expiryTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expiryTime);
  };
};

const saveAuthDataToStorage = (token, userId, expiryDate) => {
  AsyncStorage.setItem(
    "authData",
    JSON.stringify({ token, userId, expiryDate })
  );
};
