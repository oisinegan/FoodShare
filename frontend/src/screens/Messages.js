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

import { GestureHandlerRootView } from 'react-native-gesture-handler';

  function Messages({ navigation }) {
    const [user, setUser] = useContext(Context);
  
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
            <Text>Messsages</Text>
        </View>
        <Nav/>
      </SafeAreaView>
      </GestureHandlerRootView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      flex: 1,
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
  });
  
  export default Messages;
  