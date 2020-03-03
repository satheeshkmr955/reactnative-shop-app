import React, { useEffect } from "react";
import moment from "moment";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  AsyncStorage
} from "react-native";
import { useDispatch } from "react-redux";

import { authenticate } from "../store/actions/auth";
import Colors from "../constants/Colors";

const StartUpScreen = props => {
  const dispatch = useDispatch();
  useEffect(() => {
    const tryLogin = async () => {
      const authData = await AsyncStorage.getItem("authData");
      if (!authData) {
        props.navigation.navigate("Auth");
        return;
      }
      const authObj = JSON.parse(authData);
      const { token, userId, expiryDate } = authObj;
      if (moment(expiryDate).isBefore(moment()) || !token || !userId) {
        props.navigation.navigate("Auth");
        return;
      }
      props.navigation.navigate("Shop");
      const expiryTime = new Date(expiryDate).getTime() - new Date().getTime();
      dispatch(authenticate({ token, userId, expiryTime }));
    };
    tryLogin();
  }, [dispatch]);
  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
export default StartUpScreen;
