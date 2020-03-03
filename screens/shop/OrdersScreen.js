import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  Platform,
  View,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import { getOrders } from "../../store/actions/orders";
import Colors from "../../constants/Colors";

const OrdersScreen = props => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const orders = useSelector(state => state.orders.orders);

  useEffect(() => {
    const asyncLoading = async () => {
      setLoading(true);
      await dispatch(getOrders());
      setLoading(false);
    };
    asyncLoading();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Order Found. Please Order Some</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <OrderItem
          totalAmount={itemData.item.totalAmount}
          date={itemData.item.dateString}
          items={itemData.item.items}
        />
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

OrdersScreen.navigationOptions = navData => {
  return {
    headerTitle: "Your Orders",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => navData.navigation.toggleDrawer()}
        />
      </HeaderButtons>
    )
  };
};

export default OrdersScreen;
