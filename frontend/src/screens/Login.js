import {
  StyleSheet,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text,
  SafeAreaView,
  View,
  Button,
  Alert,
  TextInput,
  Image,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import { decodeToken } from "react-jwt";
import AsyncStorage from "@react-native-async-storage/async-storage";

import React, { useContext, useState } from "react";
import { Context } from "../../App";
import Nav from "../components/Nav";

function Login({ navigation }) {
  const [info, setInfo] = useState([{}]);
  const [user, setUser] = useContext(Context);
  const ip = "http://192.168.1.8:8000";

  const handleChange = (name, val) => {
    setInfo((prev) => {
      return { ...prev, [name]: val.trim() };
    });
    info;
  };

  const handleSubmit = async () => {
    if (!info.username || !info.password) {
      info;
      Alert.alert("ERROR", "Fill in all fields!");
      return;
    }

    try {
      const response = await fetch(ip + "/Login", {
        method: "post",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      result;
      if (result.user) {
        try {
          await AsyncStorage.setItem("token", result.user);
          const decoded = decodeToken(result.user);
          setUser(decoded);
        } catch (error) {
          "Error logging in: " + error;
        }

        navigation.navigate("Landing");
      } else {
        Alert.alert("ERROR", "Wrong user or pass");
      }
    } catch (e) {
      "FETCH ERROR: " + e;
      Alert.alert("ERROR", "ERROR");
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.innerContainer}>
          <View style={styles.conBorder}>
            <TextInput
              placeholder="Email"
              style={styles.input}
              onChangeText={(val) => handleChange("username", val)}
            />
            <TextInput
              secureTextEntry={true}
              placeholder="Password"
              style={styles.input}
              onChangeText={(val) => handleChange("password", val)}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.text}>Login</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 20 }}>
              Don't have an account?{" "}
              <Text
                style={{
                  textDecorationLine: "underline",
                  color: "rgba(10, 10, 50.2, 0.8)",

                  fontSize: 20,
                }}
                onPress={() => navigation.navigate("Register")}
              >
                Register
              </Text>
            </Text>
          </View>
        </View>
      </View>
      <Nav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafaf9",
    height: "94.5%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "25%",
  },
  innerContainer: {
    flex: 1,
    width: "90%",
  },
  conBorder: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 25,
    padding: 15,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 20,
    paddingBottom: 25,
  },
  input: {
    borderWidth: 2,
    borderRadius: 15,
    padding: 10,
    marginVertical: 20,
    marginHorizontal: 10,
    borderColor: "black",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    marginBottom: 25,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default Login;
