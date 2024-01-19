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

function Nav({ navigation }) {
  const [user, setUser] = useContext(Context);

  return (
    <SafeAreaView>
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
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.nav}>Register</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => navigation.navigate("Post")}>
                <Text style={styles.nav}>Post</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Charity")}>
                <Text style={styles.nav}>Charity</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Text style={styles.nav}>Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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

export default Nav;
