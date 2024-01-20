import React, { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import Landing from "./src/screens/Landing";
import Post from "./src/screens/Post";
import Charity from "./src/screens/Charity";
import Profile from "./src/screens/Profile";
const Stack = createNativeStackNavigator();
export const Context = React.createContext();
import AsyncStorage from "@react-native-async-storage/async-storage";

import { decodeToken } from "react-jwt";

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    checkIfTokenExists();
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

  return (
    <NavigationContainer>
      <Context.Provider value={[user, setUser]}>
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
        </Stack.Navigator>
      </Context.Provider>
    </NavigationContainer>
  );
}
