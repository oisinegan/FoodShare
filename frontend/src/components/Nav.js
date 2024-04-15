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
} from "react-native";
import { decodeToken } from "react-jwt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import home from "../images/home.png";
import write from "../images/write.png";
import charity from "../images/Charity.png";
import noPic from "../images/noPic.png";

import React, { useContext, useState,useEffect } from "react";
import { Context } from "../../App";

function Nav() {
  const [user, setUser] = useContext(Context);
  const [userInfo, setUserInfo] = useState(null);
  const ip = "http://192.168.1.8:8000";
  const navigation = useNavigation();
  console.log(user);
  useEffect(() => {
    if (user != null) {
      console.log("PRINT")
      console.log(user)
      getUserInfo();
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


  return (
    <SafeAreaView>
      <View style={styles.con}>
        <View style={styles.conInner}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("Landing")}
          >
            <Image source={home} style={styles.navButton} />
          </TouchableOpacity>

          {/*User is null*/}
          {user === null ? (
            <>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Image source={noPic} style={styles.navButton} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => navigation.navigate("Post")}>
                <Image source={write} style={styles.navButton} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Charity", { chatUsername: user.name })
                }
              >
                <Image source={charity} style={styles.navButton} />
              </TouchableOpacity>
              
              {userInfo && userInfo[0].url ? (
   <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Image
                source={{ uri: userInfo[0].url }}
                style={styles.navButtonProfile}
              />
                </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Image source={noPic} style={styles.navButton} />
              </TouchableOpacity>
            )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

/*
 {userInfo ? (
   <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Image
                source={{ uri: userInfo[0].url }}
                style={styles.profileImage}
              />
                </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Image source={noPic} style={styles.navButton} />
              </TouchableOpacity>
            )}


*/

const styles = StyleSheet.create({
  con: {
    backgroundColor: "white",
  },
  conInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
    borderTopColor: "grey",
    borderTopWidth: 2,
    paddingHorizontal: 35,
  },
  nav: {
    fontSize: 20,
  },
  navButton: {
    width: 35,
    height: 35,
  },
  navButtonProfile:{
    width: 40,
    height: 40,
    borderRadius:30,
  },
});

export default Nav;
