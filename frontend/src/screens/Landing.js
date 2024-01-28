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
  ScrollView,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../App";
import Nav from "../components/Nav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import redIcon from "../images/redIcon.png";
import * as Location from "expo-location";
import { add } from "date-fns";

function Landing({ navigation }) {
  const [user, setUser] = useContext(Context);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  /*
  - use user context for long and lat in profile page
  - On proilfe user context shows long and lat nothing else. Check line 46 - 50 landing.ks
  */

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log("BEFOREW: Add loc to user");
      console.log(user);
      const long = location.coords.longitude;
      const lat = location.coords.latitude;
      const addLocToUser = { ...user, long, lat };
      console.log("Add loc to user");
      console.log(addLocToUser);

      setUser(addLocToUser);
      console.log(user);
    })();
  }, []);

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      const response = await fetch("http://192.168.1.8:8000/getAllItems", {
        method: "get",
      });

      const result = await response.json();
      if (result) {
        //console.log(result);
        const filteredRes = result.filter(
          (item) => Object.keys(item).length !== 0
        );
        setItems(filteredRes);
      } else {
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      console.log("GET ERROR: " + e);
      Alert.alert("ERROR", "ERROR");
    }
  };

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
      <ScrollView style={styles.contentContainer}>
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

        {items.map((item) => (
          <View style={styles.postContainer}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{
                  uri: item.image_url,
                }}
              />
            </View>
            <View style={styles.postInnerContainer}>
              <Text style={styles.innerTitle}>{item.item}</Text>
              <View style={styles.postInnerInfoContainer}>
                <Text style={styles.innerInfo}>{item.brand}</Text>
                <Text style={styles.innerInfo}>.</Text>
                <Text style={styles.innerInfo}>
                  {item.size + " " + item.measurementType}{" "}
                </Text>
                <Text style={styles.innerInfo}>.</Text>
                <Text style={styles.innerInfo}>Expiry: {item.expiryDate}</Text>
              </View>
              <Text style={styles.extraInfo}>{item.extraInfo}</Text>
              <View style={styles.postLikeButton}>
                <Image source={redIcon} style={styles.postLikeButtonIcon} />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

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

    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  innerInfo: {
    fontSize: 15,
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
