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
  useWindowDimensions,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../App";
import Nav from "../components/Nav";
import * as Location from "expo-location";
import { TabView, SceneMap } from "react-native-tab-view";

function Profile({ navigation }) {
  const [user, setUser] = useContext(Context);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [town, setTown] = useState(null);

  const [items, setItems] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  console.log(user);
  useEffect(() => {
    if (user != null) {
      fetchAllItems();
      fetchLikedItems();
    }
  }, [user]);

  const fetchAllItems = async () => {
    console.log("userid = " + user.id);
    try {
      console.log("userid = " + user.id);

      const response = await fetch("http://192.168.1.8:8000/retrieveUserAds", {
        method: "post",
        body: JSON.stringify({ user }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result) {
        //console.log(result);
        // const filteredRes = result.filter(
        //   (item) => Object.keys(item).length !== 0
        // );

        /******** UPDATE FETCH TO NOT SEND USERS OWN ADS **************/

        setItems(result);
      } else {
        console.log("No Result");
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      console.log("GET ERROR: " + e);
      Alert.alert("ERROR", "ERROR");
    }
  };

  const fetchLikedItems = async () => {
    console.log("userid = " + user.id);
    try {
      console.log("userid = " + user.id);
      console.log("CALLING LIKED ADS");
      const response = await fetch("http://192.168.1.8:8000/retrieveLikedAds", {
        method: "post",
        body: JSON.stringify({ user }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result) {
        setLikedItems(result);
        console.log(result);
      } else {
        console.log("No Result");
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

  const userAdsRoute = () => (
    <View>
      <Text style={styles.title}>Your posts</Text>
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
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const activityRoute = () => (
    <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
  );

  const likesRoute = () => (
    <View>
      <Text style={styles.title}>Liked ads</Text>
      <ScrollView>
        {likedItems.map((item) => (
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
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderScene = SceneMap({
    userAds: userAdsRoute,
    activity: activityRoute,
    likes: likesRoute,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "userAds", title: "Posts" },
    { key: "activity", title: "Activity" },
    { key: "likes", title: "Likes" },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Profile screen {user.name} - {town}
        </Text>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
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
    flex: 1.5,

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
});

export default Profile;
