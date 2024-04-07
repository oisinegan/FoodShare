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
  ScrollView,
  StatusBar,
  processColor,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../App";
import Nav from "../components/Nav";
import noPic from "../images/noPic.png";
import message from "../images/message.png";
import * as Location from "expo-location";
import { StreamChat } from "stream-chat";
import { chatApiKey } from "../config/chatConfig";

function AdInterest({ route, navigation }) {
  const [user, setUser] = useContext(Context);
  const [location, setLocation] = useState(null);
  const [interest, setInterest] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const { params } = route;
  const ad = params;
  const chatClient = StreamChat.getInstance(chatApiKey);
  const ip = "http://192.168.1.8:8000";

  useEffect(() => {
    if (ad != null) {
      getUserInfo();
      fetchUsers();
      getUserLoc();
      setupClient();
    }
  }, [ad]);

  const [clientIsReady, setClientIsReady] = useState(false);

  const setupClient = async () => {
    console.log("WAITING 1");

    //await chatClient.disconnectUser();

    try {
      chatClient.connectUser(
        {
          id: user.name.toString(),
          name: user.name.toString(),
        },
        chatClient.devToken(user.name.toString())
      );

      //console.log('Connected User ID from set up client:', chatClient.user.id);
      console.log("IS CLIENT READY - " + clientIsReady);
      setClientIsReady(true);
      console.log("IS CLIENT READY - " + clientIsReady);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `An error occurred while connecting the user: ${error.message}`
        );
      }
    }
  };

  if (!chatClient.user) {
    setupClient();
  }

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

        setUserInfo(result);
      } else {
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      Alert.alert("ERROR", e);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(ip + "/getResponses", {
        method: "post",
        body: JSON.stringify(ad),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result) {
        const filteredRes = result.filter(
          (item) => Object.keys(item).length !== 0
        );

        setInterest(filteredRes);
      } else {
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      console.log("GET ERROR: " + e);
      Alert.alert("ERROR", "ERROR FETCHING");
    }
  };

  function calculateDistance(adLat, adLon) {
    //Formual from :
    //https://www.geeksforgeeks.org/haversine-formula-to-find-distance-between-two-points-on-a-sphere/

    // distance between latitude and longitudes
    let userLat = ad?.lat;
    let userLong = ad?.long;

    console.log("user inter: " + adLat + " " + adLon);
    console.log("user: " + userLat + " " + userLong);
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

  const getUserLoc = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const createMessageChannel = async (otherUser) => {
    console.log("PRESSED");
    console.log(user.name);
    console.log("PRESSED");
    try {
      const userN = user.name.toString().toLowerCase();
      const otherUserN = otherUser.name.toString().toLowerCase();
      const channelName = userN + "_" + otherUserN + "/" + ad.id;
      console.log("channelName:", channelName);
      const channel = chatClient.channel("messaging", {
        name: channelName,
        members: [userN, otherUserN],
      });

      await channel.create();
      navigation.navigate("Messages");
    } catch (e) {
      console.log("ERROR CREATING CHANNEL: " + e);
    }
  };

  if (clientIsReady) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backText} onPress={() => navigation.goBack()}>
              Back
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.titleText}>Interest in {ad.name}..</Text>

          {interest.map((item) => (
            <View style={styles.interestCont}>
              <View style={styles.imageCont}>
                {item.url ? (
                  <Image source={{ uri: item.url }} style={styles.image} />
                ) : (
                  <Image source={noPic} style={styles.image} />
                )}
              </View>

              <View style={styles.innerInterestCont}>
                <Text style={styles.innerName}>{item.name}</Text>

                <Text style={styles.innerPoints}>
                  Share points: {item.points}
                </Text>

                <Text style={styles.innerDist}>
                  Distance: {calculateDistance(item.lat, item.long)}km{" "}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.imageMsgContainer}
                onPress={() => createMessageChannel(item)}
              >
                <View style={styles.imageMsgInnerContainer}>
                  <Image source={message} style={styles.imageMsg} />
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <Nav />
      </SafeAreaView>
    );
  } else {
    <SafeAreaView>
      <Text>Waiting on user</Text>
    </SafeAreaView>;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
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
  interestCont: {
    flexDirection: "row",

    backgroundColor: "",
    marginBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "grey",
  },
  imageCont: {
    padding: 15,
  },
  image: {
    height: 70,
    width: 70,
    borderRadius: 20,
  },
  innerInterestCont: {
    justifyContent: "center",
  },
  innerName: {
    fontSize: 20,
    fontWeight: "500",
  },
  innerPoints: {
    fontSize: 20,
    fontWeight: "300",
    marginVertical: 4,
  },
  innerDist: {
    fontSize: 20,
    fontWeight: "300",
  },
  titleText: {
    fontSize: 30,
    fontWeight: "40",
    padding: 20,
    textAlign: "center",
  },
  imageMsgContainer: {
    // // padding: 25,
    flex: 1,
    flexDirection: "row",

    justifyContent: "flex-end",
    paddingRight: 30,
    alignItems: "center",
  },
  imageMsgInnerContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightblue",
    borderRadius: 30,
    padding: 7,
  },
  imageMsg: {
    height: 40,
    width: 40,
  },
});

export default AdInterest;
