import axios from "axios";

import Order from "../../models/order";
export const SET_ORDERS = "SET_ORDERS";
export const ADD_ORDER = "ADD_ORDER";

export const getOrders = () => {
  return async (dispatch, state) => {
    const { userId } = state().auth;
    const { data: getOrders } = await axios.get(`/orders/${userId}`);
    // console.log(getOrders);
    const orders = [];
    for (let key in getOrders) {
      const { amount, date, items } = getOrders[key];
      orders.push(new Order(key, items, amount, new Date(date)));
    }
    dispatch({ type: SET_ORDERS, orders });
  };
};

export const addOrder = (cartItems, totalAmount) => {
  const date = new Date();
  const payload = {
    items: cartItems,
    amount: totalAmount,
    date: date.toISOString()
  };
  return async (dispatch, state) => {
    const { token, userId } = state().auth;
    const { data: createdOrder } = await axios.post(
      `/orders/${userId}`,
      payload,
      {
        params: { auth: token }
      }
    );
    // console.log("createdOrder", createdOrder);
    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: createdOrder.name,
        items: cartItems,
        amount: totalAmount,
        date
      }
    });
  };
};
