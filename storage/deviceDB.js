import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(value.email, jsonValue);
  } catch (e) {
    Alert.alert("An Error Occurred!", e, [{ text: "Okay" }]);
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    Alert.alert("An Error Occurred!", e, [{ text: "Okay" }]);
  }
};
