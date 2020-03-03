import React, { useEffect, useCallback, useReducer, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import { createProduct, updateProduct } from "../../store/actions/products";
import HeaderButton from "../../components/UI/HeaderButton";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_INPUT_UPDATE:
      const updatedInputValues = {
        ...state.inputValues,
        [action.inputType]: action.value
      };
      const updatedInputValidities = {
        ...state.inputValidities,
        [action.inputType]: action.value
      };
      let updatedFormIsValid = true;
      for (let key in updatedInputValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedInputValidities[key];
      }
      return {
        inputValues: updatedInputValues,
        inputValidities: updatedInputValidities,
        formIsValid: updatedFormIsValid
      };
  }
  return state;
};

const EditProductScreen = props => {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState();

  const dispatch = useDispatch();
  const productId = props.navigation.getParam("productId");
  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === productId)
  );

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: ""
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false
    },
    formIsValid: editedProduct ? true : false
  });

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong Input!", "Please check the errors in the form.", [
        { text: "Okay" }
      ]);
      return;
    }
    const { title, description, imageUrl, price } = formState.inputValues;
    setLoading(true);
    setIsError(null);
    try {
      if (editedProduct) {
        await dispatch(updateProduct(productId, title, description, imageUrl));
      } else {
        await dispatch(createProduct(title, description, imageUrl, +price));
      }
      props.navigation.goBack();
    } catch (err) {
      setIsError(err.message);
    }
    setLoading(false);
  }, [dispatch, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputType, text, isValid) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: text,
        isValid,
        inputType: inputType
      });
    },
    [dispatchFormState]
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            errorText="Please enter a valid title!!!"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            initialValue={editedProduct ? editedProduct.title : ""}
            initiallyValid={!!editedProduct}
            onInputChange={inputChangeHandler}
            required
          />
          <Input
            id="imageUrl"
            label="Image Url"
            errorText="Please enter a valid image url!!!"
            returnKeyType="next"
            initialValue={editedProduct ? editedProduct.imageUrl : ""}
            initiallyValid={!!editedProduct}
            onInputChange={inputChangeHandler}
            required
          />
          {editedProduct ? null : (
            <Input
              id="price"
              label="Price"
              errorText="Please enter a valid price!!!"
              keyboardType="decimal-pad"
              returnKeyType="next"
              initialValue={editedProduct ? editedProduct.price : ""}
              initiallyValid={!!editedProduct}
              onInputChange={inputChangeHandler}
              required
              min={0.1}
            />
          )}
          <Input
            id="description"
            label="Description"
            errorText="Please enter a valid description!!!"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            returnKeyType="done"
            initialValue={editedProduct ? editedProduct.description : ""}
            initiallyValid={!!editedProduct}
            onInputChange={inputChangeHandler}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

EditProductScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    )
  };
};

export default EditProductScreen;
