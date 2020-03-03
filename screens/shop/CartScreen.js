import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  ActivityIndicator
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import { removeFromCart } from "../../store/actions/cart";
import { addOrder } from "../../store/actions/orders";

const CartScreen = props => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
  const cartItems = useSelector(state => {
    const itemsArr = [];
    for (key in state.cart.items) {
      itemsArr.push({ ...state.cart.items[key], productId: key });
    }
    return itemsArr.sort((a, b) => {
      a.productId > b.productId ? 1 : -1;
    });
  });
  const sendOrderHandler = async () => {
    setLoading(true);
    await dispatch(addOrder(cartItems, cartTotalAmount));
    setLoading(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.primaryText}>
            ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <Button
            title="Order Now"
            color={Colors.secondary}
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          />
        )}
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.productId}
        renderItem={itemData => (
          <CartItem
            deletable
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            quantity={itemData.item.quantity}
            onRemove={() => {
              dispatch(removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: "Your Carts"
};

const styles = StyleSheet.create({
  container: {
    margin: 20
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white"
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18
  },
  primaryText: {
    color: Colors.primary
  }
});

export default CartScreen;
