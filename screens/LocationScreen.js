import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Button,
  Alert,
  BackHandler,
} from "react-native";
import Card from "../components/Card";
import Colors from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

const LocationScreen = ({ navigation }) => {
  const [loc, setLoc] = useState("");
  const [finalRes, setFinalRes] = useState({});
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => BackHandler.removeEventListener("hardwareBackPress");
  }, []);

  const getLocation = async () => {
    if (!loc) {
      Alert.alert("Error", "Location cannot be empty", [{ text: "okay" }]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=43f941a77a004ab8ab8135750212207&q=${loc}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const secondRes = await res.json();
      if (secondRes.error) {
        Alert.alert("Error", secondRes.error.message, [{ text: "okay" }]);
        setLoc("");
        return;
      }
      setFinalRes((prev) => {
        return { ...prev, data: secondRes };
      });
      setLoc("");
    } catch (e) {
      Alert.alert("Error", e, [{ text: "okay" }]);
      setLoc("");
      return;
    }
  };

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={50} style={styles.screen}>
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            {!finalRes.data ? (
              <View style={styles.formControl}>
                <Text style={styles.label}>Enter the name of your place</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="default"
                  required
                  autoCapitalize="none"
                  value={loc}
                  onChangeText={setLoc}
                />
                <View style={styles.buttonContainer}>
                  <Button
                    title="Get Location"
                    color={Colors.primary}
                    onPress={getLocation}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.formControl}>
                <Text style={styles.label}>
                  Region : {finalRes.data.location.region}
                </Text>
                <Text style={styles.label}>
                  Country : {finalRes.data.location.country}
                </Text>
                <Text style={styles.label}>
                  Date and Time : {finalRes.data.location.localtime}
                </Text>
                <Text style={styles.label}>
                  Temperature : {finalRes.data.current.temp_c}C ||{" "}
                  {finalRes.data.current.temp_f}F
                </Text>
                <Text style={styles.label}>
                  Condition : {finalRes.data.current.condition.text}
                </Text>
                <Text style={styles.label}>
                  Humidity : {finalRes.data.current.humidity}
                </Text>
                <View style={styles.buttonContainer}>
                  <Button
                    title="Enter different location"
                    color={Colors.primary}
                    onPress={() => {
                      setFinalRes({});
                    }}
                  />
                </View>
              </View>
            )}
            <View style={styles.buttonContainer}>
              <Button
                title="Logout"
                color={Colors.primary}
                onPress={() => {
                  navigation.navigate("Main");
                  setLoc("");
                  setFinalRes({});
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 600,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  formControl: {
    width: "100%",
  },
  label: {
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
});

export default LocationScreen;
