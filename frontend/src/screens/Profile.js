import {
  StyleSheet,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text,
  SafeAreaView,
  View,
  Button,
  ScrollView,
  Alert,
  TextInput,
  Image,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../App";
import Nav from "../components/Nav";
import * as Location from "expo-location";

function Profile({ navigation }) {
  const [user, setUser] = useContext(Context);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [town, setTown] = useState(null);

  const [items, setItems] = useState([]);
  console.log(user);
  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    console.log("userid = " + user.id);
    try {
      const response = await fetch("http://192.168.1.8:8000/retrieveUserAds", {
        method: "post",
        body: JSON.stringify({ id: user.id }),
      });

      const result = await response.json();
      if (result) {
        //console.log(result);
        const filteredRes = result.filter(
          (item) => Object.keys(item).length !== 0
        );

        /******** UPDATE FETCH TO NOT SEND USERS OWN ADS **************/

        setItems(removeUserAds);
      } else {
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      console.log("GET ERROR: " + e);
      Alert.alert("ERROR", "ERROR");
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);

    getLocName(location);
  }

  async function getLocName(location) {
    try {
      const response = await fetch(
        "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
          location.coords.latitude +
          "&lon=" +
          location.coords.longitude,
        {
          method: "get",
        }
      );

      const result = await response.json();

      if (result) {
        if (result.address.town != null) {
          setTown(result.address.town);
        } else if (result.address.suburb != null) {
          setTown(result.address.suburb);
        } else if (result.address.village != null) {
          setTown(result.address.village);
        } else if (result.address.city_district != null) {
          setTown(result.address.city_district);
        }
      } else {
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      console.log("GET ERROR: " + e);
      Alert.alert("ERROR", "ERROR");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Profile screen {user.name}</Text>

        {town !== null ? (
          <>
            <Text>{town}</Text>
          </>
        ) : (
          <Text>town</Text>
        )}
        <ScrollView>
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
                  <Text style={styles.innerInfo}>
                    Expiry: {item.expiryDate}
                  </Text>
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
});

export default Profile;
