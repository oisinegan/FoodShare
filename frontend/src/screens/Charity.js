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
import MapView from "react-native-maps";

function Charity({ navigation }) {
  const [user, setUser] = useContext(Context);
  // const mapsKey = process.env.MAPS_KEY;
  // console.log(process.env.MAPS_KEY);

  const [items, setItems] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (user != null) {
      fetchAllItems();
      getUserLoc();
    }
  }, [user]);

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
      console.log("BEFORE FETCH" + user.id);
      const response = await fetch("http://192.168.1.8:8000/getAllItems", {
        method: "post",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result) {
        //console.log(result);
        const filteredRes = result.filter(
          (item) => Object.keys(item).length !== 0
        );

        /******** UPDATE FETCH TO NOT SEND USERS OWN ADS **************/
        console.log(user);

        // const removeUserAds = filteredRes.filter(
        //   (item) => item.userId !== user.id
        // );

        setItems(filteredRes);
        console.log(items);
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
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={MapView.PROVIDER_GOOGLE}
        />
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
    backgroundColor: "yellow",
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 20,
    paddingBottom: 25,
  },
});

export default Charity;
