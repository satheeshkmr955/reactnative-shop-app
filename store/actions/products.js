import axios from "axios";
import _ from "lodash";

import Product from "../../models/products";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const getProducts = () => {
  return async (dispatch, state) => {
    const { userId } = state().auth;
    const { data: getProducts } = await axios.get("/products");
    // console.log(getProducts);
    const products = [];
    for (let key in getProducts) {
      const { title, description, imageUrl, price, ownerId } = getProducts[key];
      products.push(
        new Product(key, ownerId, title, imageUrl, description, price)
      );
    }
    const userProducts = _.filter(products, prod => prod.ownerId === userId);
    dispatch({ type: SET_PRODUCTS, products, userProducts });
  };
};

export const deleteProduct = productId => {
  return async (dispatch, state) => {
    const token = state().auth.token;
    await axios.delete(`/products/${productId}`, { params: { auth: token } });
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, state) => {
    const { token, userId } = state().auth;
    const payload = { title, description, imageUrl, price, ownerId: userId };
    const createdProduct = await axios.post("/products", payload, {
      params: { auth: token }
    });
    console.log(createdProduct.data);
    const id = createdProduct.data.name;
    dispatch({
      type: CREATE_PRODUCT,
      productData: { id, title, description, imageUrl, price, ownerId: userId }
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  const payload = { title, description, imageUrl };
  return async (dispatch, state) => {
    const token = state().auth.token;
    await axios.patch(`/products/${id}`, payload, { params: { auth: token } });
    dispatch({
      type: UPDATE_PRODUCT,
      pId: id,
      productData: payload
    });
  };
};
