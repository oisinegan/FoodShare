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
import React, { useContext, useState } from "react";
import Nav from "../components/Nav";

function Register({ navigation }) {
  const [info, setInfo] = useState([{}]);

  const handleChange = (name, val) => {
    setInfo((prev) => {
      return { ...prev, [name]: val.trim() };
    });
    (info);
  };

  const handleSubmit = async () => {
    if (!info.name || !info.email || !info.password) {
      Alert.alert("ERROR", "Fill in all fields!");
      return;
    }

    try {
      const response = await fetch("http://192.168.1.8:8000/Register", {
        method: "post",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result) {
        Alert.alert("WOEKS", "WORKS: " + result);
        navigation.navigate("Login");
      } else {
        Alert.alert("ERROR", "ERROR: USER ALREADY EXISTS");
      }
    } catch (e) {
      ("FETCH ERROR: " + e);
      Alert.alert("ERROR", "ERROR");
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <View style={styles.innerContainer}>
          <TextInput
            name="name"
            placeholder="Name"
            style={styles.input}
            onChangeText={(val) => handleChange("name", val)}
          />
          <TextInput
            name="email"
            placeholder="Email"
            style={styles.input}
            onChangeText={(val) => handleChange("email", val)}
          />

          <TextInput
            secureTextEntry={true}
            placeholder="Password"
            name="password"
            style={styles.input}
            onChangeText={(val) => handleChange("password", val)}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.text}>Register</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 20 }}>
            Already have an account?{" "}
            <Text
              style={{
                textDecorationLine: "underline",
                color: "rgba(10, 10, 50.2, 0.8)",

                fontSize: 20,
              }}
              onPress={() => navigation.navigate("Login")}
            >
              Login
            </Text>
          </Text>
        </View>
        <Nav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafaf9",
    height: "100%",
  },
  innerContainer: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.2,
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
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default Register;
