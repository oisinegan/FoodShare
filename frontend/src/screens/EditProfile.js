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
  ScrollView,
  ImageBackground,
  StatusBar,
  processColor,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../App";
import Nav from "../components/Nav";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import whiteicon from "../images/whiteicon.png";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import noPic from "../images/noPic.png";

function EditProfile({ route, navigation }) {
  const [user, setUser] = useContext(Context);
  const [location, setLocation] = useState(null);
  const { params } = route;
  const userInfo = params;
  console.log("USER LOG");
  console.log(userInfo);
  const ip = 'http://192.168.1.8:8000';

  const [info, setInfo] = useState({
    userId: user.id,
    name: user.name,
    email: user.email,
  });
  const [image, setImage] = useState(null);

  const handleChange = (name, val) => {
    setInfo((prev) => {
      return { ...prev, [name]: val.trim() };
    });

    // (info);
  };

  const handleSubmit = async () => {
    try {
      let long = location.coords.longitude;
      let lat = location.coords.latitude;
      if (!long || !lat) {
        Alert.alert("Location error!", "Could not find location! Try again!");
        return;
      }

      if (!info.name || !info.email || !image) {
        Alert.alert("ERROR", "Fill in all fields!");
        return;
      }

      const data = new FormData();
      data.append("image", image);

      //Add info items to data
      Object.keys(info).forEach((key) => {
        data.append(key, info[key]);
      });

      //Add loc to data
      data.append("long", long);
      data.append("lat", lat);

      const response = await fetch(ip+"/updateUser", {
        method: "post",
        body: data,
      });

      const result = await response.json();

      if (result) {
        
        navigation.navigate("Profile");
      } else {
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      console.log("FETCH ERROR: " + e);
      Alert.alert("ERROR", "ERROR");
    }
  };

  async function pickImage() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // (result.uri);
    // (result.assets[0].uri);

    if (!result.canceled) {
      const timeStamp = Date.now();
      const uniqueCode = uuid.v4();
      const imgName =
        "PROFILE_" + user.id + "_" + timeStamp + "_" + uniqueCode + ".jpeg";

      "IMAGE NAME: " + imgName;

      setImage({
        uri: result.assets[0].uri,
        name: imgName,
        type: "image/jpeg",
      });
    }
  }

  useEffect(() => {
    getUserLoc();
  }, []);

  const getUserLoc = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    console.log(location);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.imageOuterCon}>
          <TouchableOpacity style={styles.imageCon} onPress={pickImage}>
            {image ? (
              <Image source={ image } style={styles.image} />
            ) : (
              <Image source={noPic} style={styles.image}></Image>
            )}

            {/* <Image source={{ uri: image.uri }} style={styles.image} /> */}
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Name"
          editable={false}
          style={styles.innerInfo}
          value={info.name}
          onChangeText={(val) => handleChange("name", val)}
        />
        <TextInput
          placeholder="Email"
          editable={false}
          value={info.email}
          style={styles.innerInfo}
          onChangeText={(val) => handleChange("email", val)}
        />

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.text}>Save</Text>
        </Pressable>
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
  imageOuterCon: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 25,
  },
  imageCon: {
    width: 200,
    height: 200,
    borderRadius: 40,
  },
  image: {
    width: 200,
    borderRadius: 40,
    height: 200,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 15,
    marginHorizontal: "20%",
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  innerInfo: {
    fontSize: 15,
    paddingLeft: 15,
    borderWidth: 1,
    padding: 12,
    marginHorizontal: 10,
    borderColor: "grey",
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default EditProfile;
