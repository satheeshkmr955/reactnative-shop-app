import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Platform,
  Button,
  View,
  StyleSheet,
  Text,
  ActivityIndicator
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import { getProducts } from "../../store/actions/products";
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

const ProductOverviewScreen = props => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.availableProducts);

  const loadingProducts = useCallback(async () => {
    setRefreshing(true);
    await dispatch(getProducts());
    setRefreshing(false);
  }, [dispatch, setRefreshing]);

  useEffect(() => {
    const loadedProducts = props.navigation.addListener(
      "willFocus",
      loadingProducts
    );
    return () => {
      loadedProducts.remove();
    };
  }, [loadingProducts]);

  useEffect(() => {
    const asyncLoad = async () => {
      setLoading(true);
      await loadingProducts();
      setLoading(false);
    };
    asyncLoad();
  }, [dispatch, loadingProducts]);

  const onSelectHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Please add some!!</Text>
      </View>
    );
  }

  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={loadingProducts}
      keyExtractor={item => item.id}
      data={products}
      renderItem={itemData => (
        <ProductItem
          imageUrl={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            onSelectHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              onSelectHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="Add to Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

ProductOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: "All Products",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => navData.navigation.toggleDrawer()}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => navData.navigation.navigate("Cart")}
        />
      </HeaderButtons>
    )
  };
};

export default ProductOverviewScreen;
