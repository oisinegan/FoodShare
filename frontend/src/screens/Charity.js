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
  processColor,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../App";
import Nav from "../components/Nav";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import whiteicon from "../images/whiteicon.png";

function Charity({ navigation }) {
  const [user, setUser] = useContext(Context);
  // const mapsKey = process.env.MAPS_KEY;
  // console.log(process.env.MAPS_KEY);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}></View>
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
    backgroundColor: "yellow",
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 20,
    paddingBottom: 25,
  },

  postContainer: {
    flexDirection: "column",
    zIndex: 0,
    height: 200,
    margin: 4,
    marginBottom: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 2,
    marginHorizontal: 20,
  },
  imageContainer: {
    flex: 1,
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
    flex: 1,

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
    fontWeight: "400",
  },
  innerDistance: {
    fontSize: 16,
    paddingTop: 7.5,
    fontWeight: "bold",
    paddingLeft: 15,
  },
  postInnerInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  innerInfo: {
    fontSize: 15,
  },
  extraInfo: {
    marginTop: 10,
    fontSize: 15,
    paddingLeft: 15,
  },
  postLikeButton: {
    borderRadius: 100,
    backgroundColor: "red",
    borderWidth: 3,
    borderColor: "white",
    marginRight: 20,
    width: 65,
    height: 65,
    alignSelf: "flex-end",
    position: "absolute",
    bottom: -28,
    right: 15,
    marginLeft: -5,
  },
  buttonPressed: {
    backgroundColor: "green",
  },
  postLikeButtonIcon: {
    width: 50,
    height: 50,
    marginLeft: 4,
    marginTop: 4,
    borderRadius: 100,
  },
});

export default Charity;
