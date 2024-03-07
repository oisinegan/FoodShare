import {
  StyleSheet,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text,
  SafeAreaView,
  View,
  Button,
  RefreshControl,
  ScrollView,
  Alert,
  TextInput,
  Image,
  Dimensions,
  ImageBackground,
  useWindowDimensions,
  StatusBar,
  processColor,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../App";
import Nav from "../components/Nav";
import MapView, { Marker, Callout } from "react-native-maps";
import { TabView, SceneMap } from "react-native-tab-view";
import * as Location from "expo-location";
import users from "../images/users.png";
import whiteicon from "../images/whiteicon.png";

function ExtendedProfile({ route,navigation }) {
  const [user, setUser] = useContext(Context);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [town, setTown] = useState(null);
  const [items, setItems] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const ip = 'http://192.168.1.8:8000';

  const { params } = route;
  const loc = params;
  const lat = loc.lat;
  const long = loc.long;
  console.log(lat + " "+ long);

  useEffect(() => {
    if (user != null) {
      fetchAllItems();
      fetchLikedItems();
    }
  }, [user]);

  const fetchAllItems = async () => {
    try {
      const response = await fetch(ip+"/retrieveUserAds", {
        method: "post",
        body: JSON.stringify({ user }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result) {
        //(result);
        // const filteredRes = result.filter(
        //   (item) => Object.keys(item).length !== 0
        // );

        /******** UPDATE FETCH TO NOT SEND USERS OWN ADS **************/

        setItems(result);
      } else {
        ("No Result");
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      "GET ERROR: " + e;
      Alert.alert("ERROR", "ERROR");
    }
  };

  const fetchLikedItems = async () => {
    "userid = " + user.id;
    try {
      "userid = " + user.id;
      ("CALLING LIKED ADS");
      const response = await fetch(ip+"/retrieveLikedAds", {
        method: "post",
        body: JSON.stringify({ user }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result) {
        setLikedItems(result);
        result;
      } else {
        ("No Result");
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      "GET ERROR: " + e;
      Alert.alert("ERROR", "ERROR");
    }
  };

  const handleButtonPress = (item) => {
    console.log("PRESSED AD: " + item.id);
    console.log("PRESSED AD: " + item.item);

    navigation.navigate("AdInterest", { id: item.id, name: item.item, long:long, lat:lat });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    ("CALLED REFRESH");
    fetchAllItems();
    fetchLikedItems();

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

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
          location?.coords?.latitude +
          "&lon=" +
          location?.coords?.longitude,
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
      "GET ERROR: " + e;
      Alert.alert("ERROR", "ERROR");
    }
  }

  function calculateDistance(adLat, adLon) {
    //Formual from :
    //https://www.geeksforgeeks.org/haversine-formula-to-find-distance-between-two-points-on-a-sphere/

    // distance between latitude and longitudes
    let userLat = lat;
    let userLong = long;

    if (userLong < 0) {
      "userLong B: " + userLong;
      userLong = userLong * -1;
      "userLong A: " + userLong;
    }

    if (adLon < 0) {
      "adLon B: " + adLon;
      adLon = adLon * -1;
      "adLon A: " + adLon;
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

  const userAdsRoute = () => (
    <View >
      <Text style={styles.title}>Your posts</Text>
      <ScrollView
       style={styles.scrollCon}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
              <TouchableOpacity
                style={[styles.postLikeButton, styles.buttonPressed]}
                onPress={() => handleButtonPress(item)}
              >
                <Image source={users} style={styles.postLikeButtonIcon} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const likesRoute = () => (
    <View>
      <Text style={styles.title}>Liked ads</Text>
      <ScrollView
        style={styles.scrollCon}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
              <Text style={styles.innerDistance}>
                {calculateDistance(item.lat, item.long)}km away
              </Text>
              <Text style={styles.extraInfo}>{item.extraInfo}</Text>
              <TouchableOpacity
                style={[
                  styles.postLikeButton,
                  // isPressed.includes(item.id) && styles.buttonPressed,
                ]}
                onPress={() => unregisterInterest(item)}
              >
                <Image source={whiteicon} style={styles.postLikeButtonIcon} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderScene = SceneMap({
    userAds: userAdsRoute,
    likes: likesRoute,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "userAds", title: "Posts" },
    { key: "likes", title: "Likes" },
  ]);

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.topNav}>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backText} onPress={() => navigation.goBack()}>
                Back
              </Text>
            </TouchableOpacity>
    
            
          </View>
      <View style={styles.contentContainer}>
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
  scrollCon: {
    marginBottom: 70,
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
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 10,
   
  },
  backText: {
    color: "navy",
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 20,
  },
  viewPostsContainer: {
    justifyContent: "flex-start",
    paddingLeft: 15,
  },
  viewPostsImage: {
    width: 50,
    height: 50,
  },
  editProfileContainer: {
    justifyContent: "flex-end",
    paddingRight: 15,
  },
  editProfileImage: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  profileImageCont: {
    backgroundColor: "red",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  profileImageInnerCont: {
    backgroundColor: "yellow",

    padding: 15,
    borderRadius: 100,
  },
  profileImage: {
    height: 120,
    width: 120,
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
    backgroundColor: "green",
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
    backgroundColor: "white",
  },
  postLikeButtonIcon: {
    width: 50,
    height: 50,
    marginLeft: 4,
    marginTop: 4,
    borderRadius: 100,
  },
});

export default ExtendedProfile;
