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

function AdInterest({ route, navigation }) {
  const [user, setUser] = useContext(Context);
  const [interest, setInterest] = useState([]);
  const { params } = route;
  const ad = params;
  // const mapsKey = process.env.MAPS_KEY;
  // (process.env.MAPS_KEY);

  useEffect(() => {
    if (ad != null) {
      fetchUsers();
    }
  }, [ad]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://192.168.1.8:8000/getResponses", {
        method: "post",
        body: JSON.stringify(ad),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log(result);
      if (result) {
        const filteredRes = result.filter(
          (item) => Object.keys(item).length !== 0
        );
        console.log(filteredRes);
        setInterest(filteredRes);
      } else {
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      console.log("GET ERROR: " + e);
      Alert.alert("ERROR", "ERROR FETCHING");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text>Interest {ad.id}</Text>

        {interest.map((item) => (
          <View>
            <Text>Email :{item.email}</Text>
            <Text>Name :{item.name}</Text>
          </View>
        ))}
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
    backgroundColor: "white",
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

export default AdInterest;
