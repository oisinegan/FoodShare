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

function Charity({ navigation }) {
  const [user, setUser] = useContext(Context);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Charity screen {user.name}</Text>
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
  title: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 20,
    paddingBottom: 25,
  },
});

export default Charity;
