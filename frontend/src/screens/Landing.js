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
import whiteicon from "../images/whiteicon.png";
import * as Location from "expo-location";
import { add } from "date-fns";

function Landing({ navigation }) {
  const [user, setUser] = useContext(Context);
  const [isPressed, setIsPressed] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleButtonPress = (item) => {
    if (isPressed.includes(item.id)) {
      console.log(isPressed);
      setIsPressed(isPressed.filter((val) => val !== item.id));
      console.log(isPressed);

      //Create method to unregisterInterest
      // - -- - - - - -- - -- -
    } else {
      setIsPressed([...isPressed, item.id]);
      registerInterest(item);
    }
  };

  const registerInterest = async (item) => {
    try {
      const response = await fetch("http://192.168.1.8:8000/registerInterest", {
        method: "post",
        body: JSON.stringify({
          adId: item.id,
          author: item.userId,
          userInterested: user.id,
        }),

        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result) {
        Alert.alert("Interest sent!");
      } else {
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      console.log("GET ERROR: " + e);
      Alert.alert("ERROR", "ERROR");
    }
  };

  /*
  *
    ON initial render locatoin is null: wait for location before calculating distance
    *
  */

  const [distance, setDistance] = useState(null);

  function calculateDistance(adLat, adLon) {
    //Formual from :
    //https://www.geeksforgeeks.org/haversine-formula-to-find-distance-between-two-points-on-a-sphere/

    // distance between latitude and longitudes
    let userLat = location.coords.latitude;
    let userLong = location.coords.longitude;

    if (userLong < 0) {
      console.log("userLong B: " + userLong);
      userLong = userLong * -1;
      console.log("userLong A: " + userLong);
    }

    if (adLon < 0) {
      console.log("adLon B: " + adLon);
      adLon = adLon * -1;
      console.log("adLon A: " + adLon);
    }

    let dLat = ((adLat - userLat) * Math.PI) / 180.0;
    let dLon = ((adLon - userLong) * Math.PI) / 180.0;

    // convert to radiansa
    userLat = (userLat * Math.PI) / 180.0;
    adLat = (adLat * Math.PI) / 180.0;

    // apply formulae
    let a =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.pow(Math.sin(dLon / 2), 2) * Math.cos(userLat) * Math.cos(adLat);
    let rad = 6371;
    let c = 2 * Math.asin(Math.sqrt(a));
    let ans = rad * c;
    if (ans < 2) {
      return 2;
    } else {
      return Math.round(ans);
    }
  }

  const [items, setItems] = useState([]);
  console.log(user);
  useEffect(() => {
    fetchAllItems();
    getUserLoc();
  }, []);

  const getUserLoc = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    console.log(location);
  };

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

        /******** UPDATE FETCH TO NOT SEND USERS OWN ADS **************/
        const removeUserAds = filteredRes.filter(
          (item) => item.userId !== user.id
        );

        setItems(removeUserAds);
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
              <Text style={styles.innerDistance}>
                {calculateDistance(item.lat, item.long)}km away
              </Text>
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
              <TouchableOpacity
                style={[
                  styles.postLikeButton,
                  isPressed.includes(item.id) && styles.buttonPressed,
                ]}
                onPress={() => handleButtonPress(item)}
              >
                <Image source={whiteicon} style={styles.postLikeButtonIcon} />
              </TouchableOpacity>
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
    height: 450,
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

export default Landing;
