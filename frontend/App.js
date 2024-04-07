import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import Landing from "./src/screens/Landing";
import Post from "./src/screens/Post";
import Charity from "./src/screens/Charity";
import Profile from "./src/screens/Profile";
import AdInterest from "./src/screens/AdInterest";
import EditProfile from "./src/screens/EditProfile";
import ExtendedProfile from "./src/screens/ExtendedProfile";
import Messages from "./src/screens/Messages";
import ChannelScreen from "./src/screens/ChannelScreen"
import ReviewCharity from "./src/screens/ReviewCharity"
import * as Location from "expo-location";
const Stack = createNativeStackNavigator();
export const Context = React.createContext();
export const LocationContext = React.createContext();
import AsyncStorage from "@react-native-async-storage/async-storage";

import { decodeToken } from "react-jwt";
import {
  OverlayProvider,Chat
} from 'stream-chat-expo';
import { AppProvider } from "./AppContext";
import { StreamChat } from 'stream-chat';
import { chatApiKey } from './src/config/chatConfig';


const chatClient = StreamChat.getInstance(chatApiKey);

export default function App() {
  const [user, setUser] = useState(null);
  const [loc, setLoc] = useState(null);
  useEffect(() => {
    checkIfTokenExists();
    getUserLoc();
  }, []);

  const checkIfTokenExists = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        console.log("TOKEN EXISTS");
        const decoded = decodeToken(token);
        setUser(decoded);
      } else {
        console.log("Token does not exist");
      }
    } catch (e) {
      console.log("ERROR checking token: " + e);
    }
  };

  const getUserLoc = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    console.log("LOCATION")
    let location = await Location.getCurrentPositionAsync({});
    console.log(location)
    setLoc(location);

  };
  //
  return (
    <AppProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
          <OverlayProvider>
          <Chat client={chatClient}>
      <Context.Provider value={[user, setUser]}>
      <LocationContext.Provider value={[loc, setLoc]}>
        <Stack.Navigator>
          <Stack.Screen
            name="Landing"
            component={Landing}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Post"
            component={Post}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Charity"
            component={Charity}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdInterest"
            component={AdInterest}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="ExtendedProfile"
            component={ExtendedProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Messages"
            component={Messages}
            options={{ headerShown: false }}
          />
             <Stack.Screen
            name="ChannelScreen"
            component={ChannelScreen}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="ReviewCharity"
            component={ReviewCharity}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </LocationContext.Provider>
      </Context.Provider>
      </Chat>
      </OverlayProvider>
    </NavigationContainer>
   </GestureHandlerRootView>
   </AppProvider>
  );
}
