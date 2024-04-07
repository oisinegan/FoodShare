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
  useWindowDimensions,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Context, LocationContext } from "../../App";
import Nav from "../components/Nav";
import * as Location from "expo-location";
import { TabView, SceneMap } from "react-native-tab-view";
import whiteicon from "../images/whiteicon.png";
import { useNavigation } from "@react-navigation/native";
import users from "../images/users.png";
import editProfile from "../images/editProfile.png";
import posts from "../images/posts.png";
import noPic from "../images/noPic.png";
import calculator from "../images/calculator.png";
import handshake from "../images/business.png";
function Profile({ navigation }) {
  const [user, setUser] = useContext(Context);
  const [loc, setLoc] = useContext(LocationContext);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [town, setTown] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const ip = "http://192.168.1.8:8000";

  const [items, setItems] = useState([]);
  const [likedItems, setLikedItems] = useState([]);

  useEffect(() => {
    if (user != null) {
      getUserInfo();
      fetchAllItems();
      fetchLikedItems();
    }
  }, [user]);
  const getUserInfo = async () => {
    try {
      const response = await fetch(ip + "/getUserInfo", {
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
        console.log(result);
        setUserInfo(result);
        console.log(result);
      } else {
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      Alert.alert("ERROR", e);
    }
  };

  const fetchAllItems = async () => {
    try {
      const response = await fetch(ip + "/retrieveUserAds", {
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
      const response = await fetch(ip + "/retrieveLikedAds", {
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
    getLocName();
  }, []);

  async function getLocName() {
    try {
      const response = await fetch(
        "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
          loc.coords.latitude +
          "&lon=" +
          loc.coords.longitude,
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.topNav}>
          <TouchableOpacity
            style={styles.viewPostsContainer}
            onPress={() =>
              navigation.navigate("ExtendedProfile", {
                long: loc.coords.longitude,
                lat: loc.coords.latitude,
              })
            }
          >
            <Image source={posts} style={styles.viewPostsImage} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editProfileContainer}
            onPress={() =>
              navigation.navigate("EditProfile", { img: userInfo[0].Url })
            }
          >
            <Image source={editProfile} style={styles.editProfileImage} />
          </TouchableOpacity>
        </View>
        <View style={styles.profileImageCont}>
          <View style={styles.profileImageInnerCont}>
            {console.log("USER INFO")}
            {console.log(userInfo)}
            {userInfo ? (
              <Image
                source={{ uri: userInfo[0].url }}
                style={styles.profileImage}
              />
            ) : (
              <Image source={noPic} style={styles.profileImage} />
            )}
          </View>
        </View>

        <Text style={styles.userTitle}>{user.name}</Text>
        <Text style={styles.locInfo}>📍{town}</Text>

        <View style={styles.activity}>
          <Text style={styles.title}>Total Shares</Text>
          <View style={styles.imgCon}>
            <Image source={handshake} style={styles.shares} />
          </View>
          {userInfo ? (
            <>
              <Text style={styles.shareRes}>{userInfo[0].points / 5}</Text>
            </>
          ) : (
            <Text></Text>
          )}

          <Text style={styles.title}>Share Points</Text>
          <View style={styles.imgCon}>
            <Image source={calculator} style={styles.shares} />
          </View>
          {userInfo ? (
            <>
              <Text style={styles.shareRes}>{userInfo[0].points}</Text>
            </>
          ) : (
            <Text></Text>
          )}
        </View>
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
  scrollCon: {
    marginBottom: 70,
  },
  contentContainer: {},
  userTitle: {
    fontSize: 50,

    textAlign: "center",
  },
  locInfo: {
    fontSize: 30,
    marginTop: 40,
    marginBottom: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  profileImageInnerCont: {
    padding: 15,
    borderRadius: 100,
  },
  profileImage: {
    height: 200,
    width: 200,
    borderRadius: 40,
  },
  activity: {
    //backgroundColor: "lightgrey",
    justifyContent: "center",
    flexDirection: "column",
    flex: 1,
    marginVertical: 10,
  },

  title: {
    fontSize: 35,
    marginTop: 10,
    textAlign: "center",
  },
  imgCon: {
    flexDirection: "row",
    justifyContent: "center",
  },
  shares: {
    height: 150,
    width: 150,
    borderRadius: 100,
    padding: 20,
    marginTop: 20,
    backgroundColor: "white",
  },
  shareRes: {
    fontSize: 45,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
});

export default Profile;
