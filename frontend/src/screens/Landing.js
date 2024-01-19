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
import { Context } from "../../App";
import Nav from "../components/Nav";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Landing({ navigation }) {
  const [user, setUser] = useContext(Context);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setUser(null);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {user === null ? (
          <Text style={styles.title}>Landing screen </Text>
        ) : (
          <Text style={styles.title}>Landing screen {user.name}</Text>
        )}

        <TouchableOpacity style={styles.logoutCon} onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.con}>
          <View style={styles.conInner}>
            <TouchableOpacity
              style={styles.navButtons}
              onPress={() => navigation.navigate("Landing")}
            >
              <Text style={styles.nav}>Home</Text>
            </TouchableOpacity>

            {/*User is null*/}
            {user === null ? (
              <>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.nav}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={styles.nav}>Register</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={() => navigation.navigate("Post")}>
                  <Text style={styles.nav}>Post</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Charity")}
                >
                  <Text style={styles.nav}>Charity</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Profile")}
                >
                  <Text style={styles.nav}>Profile</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafaf9",
    height: "100%",
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 20,
    paddingBottom: 25,
  },
  logoutCon: {
    backgroundColor: "grey",
    marginVertical: 10,
    padding: 10,
    width: "20%",
    borderRadius: 15,
  },
  con: {
    backgroundColor: "red",
  },
  conInner: {
    marginHorizontal: "10%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  nav: {
    fontSize: 20,
  },
});

export default Landing;
