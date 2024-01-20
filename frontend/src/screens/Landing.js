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
import redIcon from "../images/redIcon.png";

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
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {user === null ? (
          <Text style={styles.title}>Landing screen </Text>
        ) : (
          <>
            <Text style={styles.title}>Landing screen {user.name}</Text>
            <TouchableOpacity style={styles.logoutCon} onPress={logout}>
              <Text style={styles.logout}>Logout</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.postContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri: "https://reactnative.dev/img/tiny_logo.png",
              }}
            />
          </View>
          <View style={styles.postInnerContainer}>
            <Text style={styles.innerTitle}>Title</Text>
            <View style={styles.postInnerInfoContainer}>
              <Text style={styles.innerInfo}>Brand</Text>
              <Text style={styles.innerInfo}>.</Text>
              <Text style={styles.innerInfo}>Size</Text>
              <Text style={styles.innerInfo}>.</Text>
              <Text style={styles.innerInfo}>Expiry</Text>
            </View>
            <Text style={styles.extraInfo}>Extra</Text>
            <View style={styles.postLikeButton}>
              <Image source={redIcon} style={styles.postLikeButtonIcon} />
            </View>
          </View>
        </View>
      </View>
      <Nav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  contentContainer: {
    flex: 1,
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

  postContainer: {
    flexDirection: "column",
    zIndex: 0,
    height: 400,
    margin: 4,

    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 2,
    marginHorizontal: 20,
  },
  imageContainer: {
    flex: 4,
    position: "relative",
    zIndex: 1,
    width: "auto",
  },
  image: {
    flex: 1,

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    overflow: "hidden",

    marginBottom: -23,
  },
  postInnerContainer: {
    backgroundColor: "lightgrey",
    flex: 2,

    flexDirection: "column",
    position: "relative",
    zIndex: 2,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  innerTitle: {
    fontSize: 25,
    paddingTop: 15,
    paddingLeft: 15,
  },
  postInnerInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 60,
    marginTop: 20,
  },
  innerInfo: {
    fontSize: 15,
    paddingLeft: 15,
  },
  extraInfo: {
    marginTop: 20,
    fontSize: 15,
    paddingLeft: 15,
  },
  postLikeButton: {
    borderRadius: 100,
    backgroundColor: "white",
    marginRight: 20,
    width: 60,
    height: 60,
    alignSelf: "flex-end",
    position: "absolute",
    bottom: -25,
    right: 15,
    marginLeft: -5,
  },
  postLikeButtonIcon: {
    width: 60,
    height: 60,
  },
});

export default Landing;
