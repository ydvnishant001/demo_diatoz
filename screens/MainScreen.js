import React, { useState } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  TextInput,
  Alert,
} from "react-native";
import Card from "../components/Card";
import Colors from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { storeData, getData } from "../storage/deviceDB";

const MainScreen = ({ navigation }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDOB] = useState("");
  const [password, setPassword] = useState("");

  const validate = async () => {
    if (isSignup) {
      if (username && email && dob && password && password.length > 8) {
        await storeData({ username, email, dob, password });
        navigation.navigate("location");
      } else {
        Alert.alert(
          "Erorr",
          "All fields are mandatory and password should be greater than 8 characters long",
          [{ text: "Okay" }]
        );
      }
    }
    if (!isSignup) {
      if (!email || !password) {
        Alert.alert("Error", "All fields are mandatory", [{ text: "Okay" }]);
        return;
      }
      try {
        const db = await getData(email);
        if (
          db.email === email &&
          db.password === password &&
          email &&
          password
        ) {
          navigation.navigate("location");
        } else {
          Alert.alert("Error", "Email or password doesn't exist", [
            { text: "Okay" },
          ]);
        }
      } catch (e) {
        Alert.alert("Error", "Email or password doesn't exist", [
          { text: "Okay" },
        ]);
      }
    }
    setUsername("");
    setDOB("");
    setPassword("");
    setEmail("");
  };

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={50} style={styles.screen}>
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <View style={styles.formControl}>
              {isSignup ? (
                <>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="default"
                    required
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                  />
                </>
              ) : null}
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                required
                email
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              {isSignup ? (
                <>
                  <Text style={styles.label}>DOB</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="default"
                    required
                    autoCapitalize="none"
                    value={dob}
                    onChangeText={setDOB}
                  />
                </>
              ) : null}
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                keyboardType="default"
                secureTextEntry
                required
                minLength={8}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={isSignup ? "Sign Up" : "Login"}
                color={Colors.primary}
                onPress={validate}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignup ? "Login" : "Sign Up"}`}
                color={Colors.primary}
                onPress={() => {
                  setIsSignup((prevState) => !prevState);
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
});

export default MainScreen;
