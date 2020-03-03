import React, { useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native";

import Colors from "../../constants/Colors";
import CartItem from "./CartItem";

const OrderItem = props => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <View style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>${props.totalAmount}</Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>
      <Button
        color={Colors.primary}
        title={showDetails ? "Hide Details" : "Show Details"}
        onPress={() => {
          setShowDetails(prevState => !prevState);
        }}
      />
      {showDetails &&
        props.items.map(cartItem => {
          return (
            <View style={styles.itemDetails} key={cartItem.productId}>
              <CartItem
                quantity={cartItem.quantity}
                title={cartItem.productTitle}
                amount={cartItem.sum}
              />
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
    margin: 20,
    padding: 10,
    alignItems: "center"
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15
  },
  totalAmount: {
    fontFamily: "open-sans-bold",
    fontSize: 16
  },
  date: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: "#888"
  },
  itemDetails: {
    width: "100%"
  }
});

export default OrderItem;
