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
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../App";
import Nav from "../components/Nav";
import postIcon from "../images/postIcon.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { SelectList } from "react-native-dropdown-select-list";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import uuid from "react-native-uuid";

function Post({ navigation }) {
  const [user, setUser] = useContext(Context);
  const [location, setLocation] = useState(null);

  const [info, setInfo] = useState({
    userId: user.id,
  });
  const [image, setImage] = useState(null);

  const handleChange = (name, val) => {
    setInfo((prev) => {
      return { ...prev, [name]: val.trim() };
    });

    // (info);
  };

  const handleSubmit = async () => {
    let long = location.coords.longitude;
    let lat = location.coords.latitude;
    //Trim to 6 decimal points
    long = long.toFixed(6);
    lat = lat.toFixed(6);

    if (
      !info.foodName ||
      !info.brand ||
      !info.size ||
      !info.expiryDate ||
      !info.measurementType ||
      !info.postTo ||
      !info.quant ||
      !info.extraInfo ||
      !image
    ) {
      Alert.alert("ERROR", "Fill in all fields!");
      return;
    }

    if (!long || !lat) {
      Alert.alert("Location error!", "Could not find location! Try again!");
      return;
    }

    try {
      const data = new FormData();
      data.append("image", image);

      //Add info items to data
      Object.keys(info).forEach((key) => {
        data.append(key, info[key]);
      });

      //Add loc to data
      data.append("long", long);
      data.append("lat", lat);

      data;

      const response = await fetch("http://192.168.1.8:8000/PostAd", {
        method: "post",
        body: data,
      });

      const result = await response.json();

      if (result) {
      } else {
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      "FETCH ERROR: " + e;
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
      const imgName = user.id + "_" + timeStamp + "_" + uniqueCode + ".jpeg";

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
    location;
  };

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;

    const formattedDate = format(date, "dd-MM-yyyy");
    info.expiryDate = formattedDate;
    setDate(currentDate);
  };

  const units = [
    { key: "Kg", value: "Kg" },
    { key: "G", value: "G" },
    { key: "L", value: "L" },
    { key: "Ml", value: "Ml" },
  ];

  const postTo = [
    { key: "Group", value: "Group" },
    { key: "General", value: "General" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.title}>Post screen {user.name}</Text>

        <TextInput
          placeholder="Item"
          style={styles.innerInfo}
          onChangeText={(val) => handleChange("foodName", val)}
        />
        <TextInput
          placeholder="Brand"
          style={styles.innerInfo}
          onChangeText={(val) => handleChange("brand", val)}
        />

        <View style={styles.imageCon}>
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {image && <Image source={{ uri: image.uri }} style={styles.image} />}
        </View>

        <View style={styles.sizeCon}>
          <TextInput
            placeholder="Size"
            keyboardType={"number-pad"}
            style={styles.innerInfoSize}
            onChangeText={(val) => handleChange("size", val)}
          />
          <SelectList
            setSelected={(val) => handleChange("measurementType", val)}
            style={styles.innerInfo}
            data={units}
            save="value"
          />
        </View>
        <View style={styles.sizeCon}>
          <Text style={styles.expiryInfo}>Expiry:</Text>
          <View style={styles.dateTimeCon}>
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              style={styles.date}
              is24Hour={true}
              onChange={onChange}
            />
          </View>
        </View>
        <TextInput
          placeholder="Quantity"
          // keyboardType={Device.isAndroid ? "numeric" : "number-pad"}
          keyboardType={"number-pad"}
          style={styles.innerInfo}
          onChangeText={(val) => handleChange("quant", val)}
        />
        <SelectList
          setSelected={(val) => handleChange("postTo", val)}
          style={styles.innerInfo}
          data={postTo}
          save="value"
        />
        <TextInput
          placeholder="Extra Information"
          multiline
          style={styles.innerInfoExtra}
          onChangeText={(val) => handleChange("extraInfo", val)}
        />

        <TouchableOpacity
          style={styles.contentContainerPost}
          onPress={handleSubmit}
        >
          <Image source={postIcon} style={styles.postButtonIcon} />
        </TouchableOpacity>
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
    marginTop: 60,
    flex: 1,
    marginHorizontal: 10,
  },
  contentContainerPost: {
    alignSelf: "center",
  },
  postButtonIcon: {
    marginTop: 25,
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    paddingBottom: 25,
  },
  sizeCon: {
    flexDirection: "row",
  },

  imageCon: {
    padding: 20,
    borderRadius: 15,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 220,
    borderRadius: 15,
    marginVertical: 15,
    width: 220,
  },
  innerInfo: {
    fontSize: 15,
    paddingLeft: 15,
    borderWidth: 1,
    padding: 12,
    borderColor: "grey",
    marginBottom: 10,
    borderRadius: 10,
  },
  innerInfoExtra: {
    fontSize: 15,
    paddingLeft: 15,

    borderWidth: 1,
    padding: 12,
    borderColor: "grey",
    marginVertical: 10,
    borderRadius: 10,
    maxHeight: 160,
  },
  expiryInfo: {
    flex: 1,
    fontSize: 15,

    fontSize: 25,
    textAlign: "center",
    alignSelf: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    flex: 7,
  },
  dateTimeCon: { flex: 7, backgroundColor: "white", marginVertical: 10 },
  date: {
    alignSelf: "flex-start",
    marginLeft: -5,
    margin: 12,
    // marginRight: 50,
  },
  innerInfoSize: {
    fontSize: 15,
    paddingLeft: 15,
    borderWidth: 1,
    padding: 10,
    borderColor: "grey",
    marginRight: 10,
    borderRadius: 10,
    flex: 1,
  },
});

export default Post;
