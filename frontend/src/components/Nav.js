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

import React, { useContext, useState } from "react";
import { Context } from "../../App";

function Nav() {
  const [user, setUser] = useContext(Context);
  const navigation = useNavigation();
  console.log(user)

  return (
    <SafeAreaView>
      <View style={styles.con}>
        <View style={styles.conInner}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("Landing")}
          >
            <Image
                            source={home}
                            style={styles.navButton}
                          />
          </TouchableOpacity>

          {/*User is null*/}
          {user === null ? (
            <>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                 <Image
                            source={noPic}
                            style={styles.navButton}
                          />
              </TouchableOpacity>
            
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => navigation.navigate("Post")}>
              <Image
                            source={write}
                            style={styles.navButton}
                          />
              </TouchableOpacity>
             
              <TouchableOpacity onPress={() => navigation.navigate("Charity", { chatUsername: user.name })}>
              <Image
                            source={charity}
                            style={styles.navButton}
                          />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Image
                            source={noPic}
                            style={styles.navButton}
                          />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

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
    paddingHorizontal:35,
  },
  nav: {
    fontSize: 20,
  },
  navButton:{
    width:35,
    height:35,
  },
});

export default Nav;
