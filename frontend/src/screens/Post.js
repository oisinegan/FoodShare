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
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Context, LocationContext } from "../../App";
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
  const [loc, setLoc] = useContext(LocationContext);
  const [location, setLocation] = useState(null);
  const ip = "http://192.168.1.8:8000";
  const [posting, setPosting] = useState(false);

  const [info, setInfo] = useState({
    userId: user.id,
  });
  const [image, setImage] = useState(null);

    //errors
    const [itemErr, setItemErr] = useState("");
    const [brandErr, setBrandErr] = useState(" ");
    const [sizeErr, setSizeErr] = useState(" ");
    const [dateErr, setDateErr] = useState(" ");
    const [quantErr, setQuantErr] = useState(" ");
    const [postToErr, setPostToErr] = useState(" ");
    const [extraInfoErr, setExtraInfoErr] = useState("");
    const [imageErr, setImageErr] = useState("");

  const validate = () => {
    let noCorrectInputs = 0;
     //Item
     if (info.foodName == "") {
      setItemErr("Food name field is empty");
    }else if (info.foodName == undefined) {
      setItemErr("Food name field is empty");
    }  else if (info.foodName.length < 3) {
      setItemErr("Provide more than 3 characters!");
    } else if (info.foodName.length >= 20) {
      setItemErr("Too many characters! (Max 20 characters)");
    } else {
      noCorrectInputs++;
      setItemErr("");
    }
      //Brand
      if (info.brand == "") {
        setBrandErr("Brand field  is empty");
      }else if (info.brand == undefined) {
        setBrandErr("Brand field is empty");
      }  else if (info.brand.length < 3) {
        setBrandErr("Provide more than 3 characters!");
      } else if (info.brand.length >= 20) {
        setBrandErr("Too many characters! (Max 20 characters)");
      } else {
        noCorrectInputs++;
        setBrandErr("");
      }

       //Image
        if (image == undefined) {
        setImageErr("Upload an image!");
      } else {
        noCorrectInputs++;
        setImageErr("");
      }
       //Size
       if (info.size == "") {
        setSizeErr("Size field is empty");
      }else if (info.size == undefined) {
        setSizeErr("Size field is empty");
      }else if(info.measurementType === undefined){
        setSizeErr("Select a measurement type!")
      }else if (info.size > 2000) {
        setSizeErr("Size must be less than 2000!");
      } else if (info.size == 0) {
        setSizeErr("Size must be greater than 0");
      } else {
        noCorrectInputs++;
        setSizeErr("");
      }

        //Image
        if (info.expiryDate == undefined) {
        setDateErr("Choose an expiry!");
      } else {
        noCorrectInputs++;
        setDateErr("");
      }

      //Quantity
       if (info.quant == "") {
        setQuantErr("Quantity field is empty");
      }else if (info.quant == undefined) {
        setQuantErr("Quantity field is empty");
      }else if (info.quant > 200) {
        setQuantErr("Quantity must be less than 200!");
      } else if (info.quant == 0) {
        setQuantErr("Quantity must be greater than 0");
      } else {
        noCorrectInputs++;
        setQuantErr("");
      }

     //Post to
      if (info.postTo == undefined) {
        setPostToErr("Select an option!");
      } else {
        noCorrectInputs++;
        setPostToErr("");
      }

    //Extra info
    if (info.extraInfo == "") {
      setExtraInfoErr("Extra info field is empty");
    }else if (info.extraInfo == undefined) {
  
      setExtraInfoErr("Extra info field is empty");
    }  else if (info.extraInfo.length < 3) {
      setExtraInfoErr("Provide more than 3 characters!");
    } else if (info.extraInfo.length > 200) {
      setExtraInfoErr("Too many characters! (Max 200 characters)");
    } else {
      noCorrectInputs++;
      setExtraInfoErr("");
    }
    return noCorrectInputs;
  }


  const handleChange = (name, val) => {
    setInfo((prev) => {
      return { ...prev, [name]: val.trim() };
    });

    // (info);
  };

  const handleSubmit = async () => {
    setPosting(true);
  
    let long = loc.coords.longitude;
    let lat = loc.coords.latitude;
    //Trim to 6 decimal points
    long = long.toFixed(6);
    lat = lat.toFixed(6);


    if (!long || !lat) {
      Alert.alert("Location error!", "Could not find location! Try again!");
      return;
    }
    
    let noCorrectInputs = validate();


    console.log("HERE_____")
    console.log(noCorrectInputs);

    if(noCorrectInputs !== 8){
      Alert.alert("Fill out all fields!", "Correct fields: "+ noCorrectInputs + "/8");
      setPosting(false);
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

      const response = await fetch(ip + "/PostAd", {
        method: "post",
        body: data,
      });

      const result = await response.json();

      if (result) {
        setPosting(false);
        navigation.navigate("Landing");
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

    if (!result.canceled) {
      const timeStamp = Date.now();
      const uniqueCode = uuid.v4();
      const imgName = user.id + "_" + timeStamp + "_" + uniqueCode + ".jpeg";

      setImage({
        uri: result.assets[0].uri,
        name: imgName,
        type: "image/jpeg",
      });
    }
  }

  useEffect(() => {
    // getUserLoc();
  }, []);

  // const getUserLoc = async () => {
  //   let { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== "granted") {
  //     setErrorMsg("Permission to access location was denied");
  //     return;
  //   }
  //   let location = await Location.getCurrentPositionAsync({});
  //   setLocation(location);
  //   location;
  // };

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
    { key: "General", value: "General" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
       

        <TextInput
          placeholder="Item"
          style={styles.innerInfo}
          onChangeText={(val) => handleChange("foodName", val)}
        />
        <Text style={styles.errorMsg}>{itemErr}</Text>
        <TextInput
          placeholder="Brand"
          style={styles.innerInfo}
          onChangeText={(val) => handleChange("brand", val)}
        />
        <Text style={styles.errorMsg}>{brandErr}</Text>

        <View style={styles.imageCon}>
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {image && <Image source={{ uri: image.uri }} style={styles.image} />}
        </View>
        <Text style={styles.errorMsg}>{imageErr}</Text>

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
        <Text style={styles.errorMsg}>{sizeErr}</Text>
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
        <Text style={styles.errorMsg}>{dateErr}</Text>
        <TextInput
          placeholder="Quantity"
          // keyboardType={Device.isAndroid ? "numeric" : "number-pad"}
          keyboardType={"number-pad"}
          style={styles.innerInfo}
          onChangeText={(val) => handleChange("quant", val)}
        />
        <Text style={styles.errorMsg}>{quantErr}</Text>
        <SelectList
          setSelected={(val) => handleChange("postTo", val)}
          style={styles.innerInfo}
          data={postTo}
          save="value"
        />
        <Text style={styles.errorMsg}>{postToErr}</Text>
        <TextInput
          placeholder="Extra Information"
          multiline
          style={styles.innerInfoExtra}
          onChangeText={(val) => handleChange("extraInfo", val)}
        />
        <Text style={styles.errorMsg}>{extraInfoErr}</Text>
        {posting === true ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ marginBottom: 40, marginTop: 25 }}
          />
        ) : (
          <TouchableOpacity
            style={styles.contentContainerPost}
            onPress={handleSubmit}
          >
            <Image source={postIcon} style={styles.postButtonIcon} />
          </TouchableOpacity>
        )}
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
    marginBottom: 40,
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
    //marginBottom: 10,
    borderRadius: 10,
  },
  innerInfoExtra: {
    fontSize: 15,
    paddingLeft: 15,

    borderWidth: 1,
    padding: 12,
    borderColor: "grey",
    
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
  dateTimeCon: { flex: 7, backgroundColor: "white", },
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
  errorMsg: {
    color: "red",
    fontSize:15,
    paddingLeft: 10,
    marginTop: 2,
    marginBottom: 10,
  },
});

export default Post;
