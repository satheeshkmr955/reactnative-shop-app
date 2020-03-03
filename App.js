import React, { useState } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import { useScreens } from "react-native-screens";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { composeWithDevTools } from "redux-devtools-extension";
import axios from "axios";

axios.defaults.baseURL = "https://react-native-shop-app-ebcee.firebaseio.com";
axios.interceptors.request.use(config => {
  config.url = config.url + ".json";
  return config;
});

import NavigationContainer from "./navigation/NavigationContainer";
import productsReducer from "./store/reducers/products";
import cartsReducer from "./store/reducers/cart";
import orderReducer from "./store/reducers/orders";
import authReducer from "./store//reducers/auth";

useScreens();

const rootReducers = combineReducers({
  products: productsReducer,
  cart: cartsReducer,
  orders: orderReducer,
  auth: authReducer
});

const store = createStore(
  rootReducers,
  composeWithDevTools(),
  applyMiddleware(ReduxThunk)
);

const getFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf")
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  if (!fontLoaded) {
    return (
      <AppLoading startAsync={getFonts} onFinish={() => setFontLoaded(true)} />
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
