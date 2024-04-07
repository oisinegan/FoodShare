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
  StatusBar,
  Dimensions,
  Modal,
  RefreshControl,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Context, LocationContext } from "../../App";
import Nav from "../components/Nav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import whiteicon from "../images/whiteicon.png";
import placeholder from "../images/placeholder.png";
import settings from "../images/settings.png";
import messageIc from "../images/messageIc.png";
import searchB from "../images/search.png";
import noNewPosts from "../images/NoNewPosts.png";
import noPic from "../images/noPic.png";
import * as Location from "expo-location";
import { StreamChat } from "stream-chat";
import { chatApiKey } from "../config/chatConfig";
import { profileIMG } from "../config/settings";

import { SearchBar } from "@rneui/themed";
import MapView, { Marker, Callout, Polygon, Circle } from "react-native-maps";

function Landing({ navigation }) {
  const [user, setUser] = useContext(Context);
  const [loc, setLoc] = useContext(LocationContext);
  console.log("---------");
  console.log(loc);
  console.log("---------");
  const [isPressed, setIsPressed] = useState([]);
  //const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const chatClient = StreamChat.getInstance(chatApiKey);
  const [currView, setCurrView] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [searching, setSearching] = useState(false);
  const ip = "http://192.168.1.8:8000";
  const [userInfo, setUserInfo] = useState(null);
  const [searchReq, setSearchReq] = useState({});
  const [noneMsg, setNoneMsg] = useState("No new food posting!");

  const randomLong = Math.floor(Math.random() * (0.03 - -0.03)) + -0.03;
  const randomLat = Math.floor(Math.random() * (0.03 - -0.03)) + -0.03;
  console.log("Random long: " + randomLong);
  console.log("Random lat: " + randomLat);
  console.log("FROM SETTINGS");
  console.log(profileIMG);

  const handleChangeSearch = (name, val) => {
    setSearchReq((prev) => {
      return { ...prev, [name]: val.trim() };
    });
    console.log(searchReq);
  };

  const handleSearch = () => {
    console.log("BEFORE ENTERING CONDITION: " + searchReq.searchReq);
    if (searchReq === undefined || searchReq.searchReq === undefined) {
      console.log("SEARCH UNDEFINED");
      console.log("GETTING ALL: " + searchReq.searchReq);
      fetchAllItems();
    } else if (searchReq.searchReq.length === 0) {
      console.log("SEARCH EMPTY");
      console.log("GETTING ALL: " + searchReq.searchReq);
      fetchAllItems();
    } else {
      console.log("SEARCH");
      console.log("searchs: " + searchReq.searchReq);
      searchForItems(searchReq.searchReq);
    }
  };

  const mapView = () => {
    return (
      <View style={styles.contentContainer}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Log out?</Text>

              <Pressable
                style={[styles.button1, styles.buttonClose]}
                onPress={() => logout()}
              >
                <Text style={styles.textStyle}>Yes, Logout!</Text>
              </Pressable>

              <Pressable
                style={[styles.button2, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {user === null ? (
          <Text style={styles.title}>Landing screen </Text>
        ) : (
          <>
            <View style={styles.searchCon}>
              <View style={styles.search}>
                <TextInput
                  placeholder="Search item"
                  style={styles.searchBar}
                  //onChangeText={(val) => handleChange("extraInfo", val)}
                />
              </View>
              <TouchableOpacity onPress={() => console.log("Search")}>
                <Image source={searchB} style={styles.searchButton} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Image source={settings} style={styles.searchButton} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
                <Image source={messageIc} style={styles.searchButton} />
              </TouchableOpacity>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.changeViewButton}
                onPress={() => setCurrView(0)}
              >
                <Text style={styles.logout}>List View</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        <View style={styles.contentContainer}>
          {loc && items ? (
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.2922,
                longitudeDelta: 0.2421,
              }}
              provider={MapView.PROVIDER_GOOGLE}
            >
              {items.map((item, index) => (
                <>
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: item.lat + randomLat,
                      longitude: item.long + randomLong,
                    }}
                  >
                    <Image source={placeholder} style={styles.markerImage} />

                    <Callout style={styles.map_postOuterContainer}>
                      <View style={styles.map_postContainer}>
                        <View style={styles.map_imageContainer}>
                          <Image
                            style={styles.map_image}
                            source={{
                              uri: item.image_url,
                            }}
                          />
                        </View>
                        <View style={styles.map_postInnerContainer}>
                          <Text style={styles.map_innerTitle}>{item.item}</Text>
                          <Text style={styles.map_innerDistance}>
                            {calculateDistance(item.lat, item.long)}km away
                          </Text>

                          <Text style={styles.map_innerInfo}>{item.brand}</Text>

                          <Text style={styles.map_innerInfo}>
                            {item.size + " " + item.measurementType}{" "}
                          </Text>

                          <Text style={styles.map_innerInfo}>
                            Expiry: {item.expiryDate}
                          </Text>

                          <Text style={styles.map_extraInfo}>
                            {item.extraInfo}
                          </Text>
                          <TouchableOpacity
                            style={[
                              styles.map_postLikeButton,
                              isPressed.includes(item.id) &&
                                styles.buttonPressed,
                            ]}
                            onPress={() => handleButtonPress(item)}
                          >
                            <Image
                              source={whiteicon}
                              style={styles.map_postLikeButtonIcon}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Callout>
                  </Marker>

                  <Circle
                    center={{
                      latitude: item.lat + randomLat,
                      longitude: item.long + randomLong,
                    }}
                    radius={4000}
                    strokeWidth={1}
                    strokeColor={"#1a66ff"}
                    fillColor={"rgba(230,238,255,0.5)"}
                    onPress={() => showAdMapView(item)}
                  />
                </>
              ))}
            </MapView>
          ) : (
            <Text>Loc not ready</Text>
          )}
        </View>
      </View>
    );
  };
  /*

              
*/
  const [search, setSearch] = useState("");

  const updateSearch = (search) => {
    setSearch(search);
  };

  const listView = () => {
    return (
      <ScrollView
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Log out?</Text>

              <Pressable
                style={[styles.button1, styles.buttonClose]}
                onPress={() => logout()}
              >
                <Text style={styles.textStyle}>Yes, Logout!</Text>
              </Pressable>

              <Pressable
                style={[styles.button2, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {user === null ? (
          <Text style={styles.title}>Landing screen </Text>
        ) : (
          <>
            <View style={styles.searchCon}>
              <View style={styles.search}>
                <TextInput
                  placeholder="Search item"
                  style={styles.searchBar}
                  onChangeText={(val) => handleChangeSearch("searchReq", val)}
                />
              </View>
              {searching === true ? (
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  style={{ marginRight: 5 }}
                />
              ) : (
                <TouchableOpacity onPress={() => handleSearch()}>
                  <Image source={searchB} style={styles.searchButton} />
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Image source={settings} style={styles.searchButton} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
                <Image source={messageIc} style={styles.searchButton} />
              </TouchableOpacity>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.changeViewButton}
                onPress={() => setCurrView(1)}
              >
                <Text style={styles.logout}>Map View</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {items.length === 0 ? (
          <View style={styles.noNewPostsContainer}>
            <Image source={noNewPosts} style={styles.noNewPostsImage} />
            <Text style={styles.noNewPostsText}>{noneMsg}</Text>
          </View>
        ) : (
          items.map((item) => (
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
                {user ? (
                  <Text style={styles.innerDistance}>
                    {calculateDistance(item.lat, item.long)}km away
                  </Text>
                ) : null}
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
                {user ? (
                  user.id === 5 ? null : (
                    <TouchableOpacity
                      style={[
                        styles.postLikeButton,
                        isPressed.includes(item.id) && styles.buttonPressed,
                      ]}
                      onPress={() => handleButtonPress(item)}
                    >
                      <Image
                        source={whiteicon}
                        style={styles.postLikeButtonIcon}
                      />
                    </TouchableOpacity>
                  )
                ) : null}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    );
  };

  const controlView = () => {
    if (currView === 0) {
      return listView;
    } else {
      return mapView;
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    console.log("CALLED REFRESH");
    console.log(chatClient.user.name);
    fetchAllItems();

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleButtonPress = (item) => {
    if (isPressed.includes(item.id)) {
      isPressed;
      setIsPressed(isPressed.filter((val) => val !== item.id));
      isPressed;

      //Create method to unregisterInterest
      // - -- - - - - -- - -- -
    } else {
      setIsPressed([...isPressed, item.id]);
      registerInterest(item);
    }
  };

  const registerInterest = async (item) => {
    console.log(process.env.IP_ADDRESS + "/registerInterest");
    try {
      const response = await fetch(ip + "/registerInterest", {
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
        console.log("register Interest");
      }
    } catch (e) {
      console.log("ERROR.... " + e);
      Alert.alert("ERROR:::::", e);
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
    let userLat = loc?.coords?.latitude;
    let userLong = loc?.coords?.longitude;

    if (userLat) {
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
  }

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (user != null) {
      console.log("CALLED USE EFFECT FROM LANDING");
      getUserInfo();
      // setupClient();
      fetchAllItems();
      // getUserLoc();
    } else {
      fetchAllItems();
    }
  }, [user]);

  // const getUserLoc = async () => {
  //   let { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== "granted") {
  //     setErrorMsg("Permission to access location was denied");
  //     return;
  //   }
  //   console.log("LOCATION")
  //   let location = await Location.getCurrentPositionAsync({});
  //   console.log(location)
  //   setLocation(location);

  // };

  const fetchAllItems = async () => {
    try {
      console.log("Fetching....");
      console.log("USER");
      console.log(user);
      console.log(ip + "/getAllItems");
      if (user === null) {
        const response = await fetch(ip + "/getAllItems", {
          method: "post",
          body: JSON.stringify({ id: null }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (result) {
          //(result);
          const filteredRes = result.filter(
            (item) => Object.keys(item).length !== 0
          );

          console.log("filtered: " + filteredRes.image);
          setNoneMsg("No new food posting!");
          setItems(filteredRes);
          console.log(filteredRes);
        } else {
          console.log("ERROR getting items");
          Alert.alert("ERROR", "ERR");
        }
      } else {
        const response = await fetch(ip + "/getAllItems", {
          method: "post",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (result) {
          //(result);
          const filteredRes = result.filter(
            (item) => Object.keys(item).length !== 0
          );

          console.log("filtered: " + filteredRes.image);
          setNoneMsg("No new food posting!");
          setItems(filteredRes);
          console.log(filteredRes);
        } else {
          console.log("ERROR getting items");
          Alert.alert("ERROR", "ERR");
        }
      }
    } catch (e) {
      console.log("GET ERROR11: " + e);
      Alert.alert("ERROR", "ERROR FETCHING");
    }
  };
  const searchForItems = async (item) => {
    const reqData = { user, item };
    setSearching(true);
    try {
      console.log("Searching....");
      console.log(ip + "/searchItems");
      const response = await fetch(ip + "/searchItems", {
        method: "post",
        body: JSON.stringify(reqData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result) {
        setSearching(false);
        //(result);
        const filteredRes = result.filter(
          (item) => Object.keys(item).length !== 0
        );

        console.log("filtered: " + filteredRes.image);
        if (filteredRes.length === 0) {
          setNoneMsg("No food postings for '" + item + "'!");
        } else {
          setNoneMsg("No new food posting!");
        }
        setItems(filteredRes);
        console.log(filteredRes);
      } else {
        setSearching(false);
        console.log("ERROR getting items");
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      console.log("GET ERROR11: " + e);
      Alert.alert("ERROR", "ERROR FETCHING");
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await chatClient.disconnectUser();
      setUser(null);
      setModalVisible(!modalVisible);
    } catch (e) {
      e;
    }
  };

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
        console.log("RESULT>>>>>>>>>>>>");
        console.log(result);
        setUserInfo(result);
        console.log(result);
        setupClient(result);
      } else {
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      Alert.alert("ERROR", e);
    }
  };

  const setupClient = async (res) => {
    console.log("FROM ENV FIKE");
    console.log(process.env.MAPS_KEY);
    if (user !== null) {
      console.log("called from set up chat clietn");
      console.log(res);
      //console.log(user)
      const streamChatUserId = user.name.toString() + "_" + user.id.toString();
      const streamChatUserName = user.name.toString();

      try {
        //
        if (res && res[0].url) {
          console.log(true);
          console.log(res);
          console.log(res[0].url);
          await chatClient.connectUser(
            {
              id: streamChatUserName,
              name: streamChatUserName,
              image: res[0].url,
            },
            chatClient.devToken(streamChatUserName)
          );
          console.log("CHAT CLIENT");
          console.log(chatClient._user.image);
        } else {
          console.log(false);
          console.log(res);
          console.log(res[0].url);
          await chatClient.connectUser(
            {
              id: streamChatUserName,
              name: streamChatUserName,
              image: profileIMG,
            },
            chatClient.devToken(streamChatUserName)
          );
        }

        console.log("Connected User ID:", streamChatUserName);
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `An error occurred while connecting the user: ${error.message}`
          );
        }
      }
      console.log("Inside of ");
      console.log(chatClient.user.id);
    } else {
      console.log("USER IS NULL CANNOT SET CLIENT");
    }
  };

  if (!chatClient.userID) {
    getUserInfo();
  }
  useEffect(() => {
    console.log("useEffect triggered");
    if (chatClient && chatClient.wsConnection) {
      console.log("set up!");
      console.log(chatClient.user);
      console.log(chatClient.name);
    } else {
      console.log("NOT SET");
    }
  }, [chatClient]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar animated={true} backgroundColor="#61dafb" />
      {controlView()()}
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

  changeViewButton: {
    backgroundColor: "lightblue",
    marginVertical: 10,
    padding: 10,

    borderRadius: 15,
  },

  controls: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  searchCon: {
    // backgroundColor:"red",
    flexDirection: "row",
    alignItems: "center",
  },
  search: {
    backgroundColor: "white",
    flex: 1,
  },
  searchBar: {
    backgroundColor: "lightgrey",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "black",
  },
  searchButton: {
    height: 35,
    marginRight: 7,
    width: 35,
  },

  noNewPostsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noNewPostsImage: {
    marginTop: "25%",
    width: "80%",
    height: 300,
  },
  noNewPostsText: {
    fontWeight: "bold",
    fontSize: 30,
  },

  centeredView: {
    flex: 1,

    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#FAF9F6",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button1: {
    borderRadius: 20,
    marginTop: 10,
    padding: 15,
    elevation: 2,
    backgroundColor: "green",
  },
  button2: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    backgroundColor: "red",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: "center",
  },

  //LIST VIEW
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

  //Map VIEW
  map_postOuterContainer: {
    width: 290,
    paddingBottom: 10,
  },
  map_postContainer: {
    // backgroundColor:"red",
    flexDirection: "row",
    height: "auto",
    //width: "100%",
    //padding:40,
  },
  map_imageContainer: {
    width: 125,
    paddingRight: 5,
  },
  map_image: {
    height: "100%",
    borderRadius: 20,
  },
  markerImage: {
    height: 70,
    width: 70,
  },
  map_postInnerContainer: {
    paddingRight: 100,
    flexDirection: "column",
  },
  map_innerTitle: {
    fontSize: 25,
    paddingTop: 15,
    paddingLeft: 15,
    fontWeight: "400",
  },
  map_innerDistance: {
    fontSize: 16,
    paddingTop: 7.5,
    fontWeight: "bold",
    paddingLeft: 15,
  },

  map_innerInfo: {
    fontSize: 15,
    marginTop: 5,
    paddingLeft: 15,
  },
  map_extraInfo: {
    marginTop: 10,
    fontSize: 15,
    paddingLeft: 15,
  },
  map_postLikeButton: {
    borderRadius: 40,
    backgroundColor: "red",
    justifyContent: "center",
    alignContent: "center",
    marginTop: 15,
    width: 50,
    height: 50,
    alignSelf: "flex-end",
  },
  map_buttonPressed: {
    backgroundColor: "green",
  },
  map_postLikeButtonIcon: {
    width: 50,
    height: 50,
  },
});

export default Landing;
