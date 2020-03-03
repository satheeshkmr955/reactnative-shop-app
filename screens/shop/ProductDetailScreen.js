import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ScrollView
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import * as cartActions from "../../store/actions/cart";

const ProductDetailScreen = props => {
  const dispatch = useDispatch();
  const productId = props.navigation.getParam("productId");
  const selectedProducts = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  );
  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProducts.imageUrl }} />
      <View style={styles.buttonContainer}>
        <Button
          title="Add to Cart"
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProducts));
          }}
        />
      </View>
      <Text style={styles.price}>${selectedProducts.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProducts.description}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 10,
    alignItems: "center"
  },
  image: {
    width: "100%",
    height: 300
  },
  price: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "open-sans-bold"
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 10,
    fontFamily: "open-sans"
  }
});

ProductDetailScreen.navigationOptions = navData => {
  const productTitle = navData.navigation.getParam("productTitle");
  return { headerTitle: productTitle };
};

export default ProductDetailScreen;
