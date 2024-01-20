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
import React, { useContext, useState } from "react";
import { Context } from "../../App";
import Nav from "../components/Nav";
import postIcon from "../images/postIcon.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { SelectList } from "react-native-dropdown-select-list";

function Post({ navigation }) {
  const [user, setUser] = useContext(Context);

  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState(null);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const [selectedUnit, setSelectedUnit] = React.useState("");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    setFormattedDate(format(currentDate, "dd-MM-yyyy"));
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const units = [
    { key: "Kg", value: "Kg" },
    { key: "G", value: "G" },
    { key: "L", value: "L" },
    { key: "Ml", value: "Ml" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.contentContainerPost}>
          <Image source={postIcon} style={styles.postButtonIcon} />
        </View>

        <Text style={styles.title}>Post screen {user.name}</Text>
        <View style={styles.postContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri: "https://reactnative.dev/img/tiny_logo.png",
              }}
            />
          </View>
          <View style={styles.postInnerContainer}>
            <TextInput
              placeholder="Item"
              style={styles.innerTitle}
              // onChangeText={(val) => handleChange("username", val)}
            />
            <View style={styles.postInnerInfoContainer}>
              <TextInput
                placeholder="Brand"
                style={styles.innerInfo}
                // onChangeText={(val) => handleChange("username", val)}
              />

              <Text style={styles.innerInfo}>.</Text>
              <TextInput
                placeholder="Size"
                style={styles.innerInfo}
                // onChangeText={(val) => handleChange("username", val)}
              />
              <Text style={styles.innerInfo}>.</Text>
              <TextInput
                placeholder="Unit"
                style={styles.innerInfo}
                // onChangeText={(val) => handleChange("username", val)}
              />
              <SelectList
                setSelected={(val) => setSelectedUnit(val)}
                data={units}
                save="value"
              />
              <Text style={styles.innerInfo}>.</Text>

              {show ? (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChange}
                />
              ) : (
                <Text style={styles.innerInfo} onPress={showDatepicker}>
                  {formattedDate ? `${formattedDate}` : "Expiry"}
                </Text>
              )}
            </View>

            <TextInput
              placeholder="Extra Information"
              style={styles.extraInfo}
              // onChangeText={(val) => handleChange("username", val)}
            />
          </View>
        </View>
      </View>

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
  contentContainerPost: {
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",
  },
  postButtonIcon: {
    marginLeft: "auto",
    marginRight: 25,
    marginTop: 15,
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 25,

    textAlign: "center",

    paddingBottom: 25,
  },

  postContainer: {
    flexDirection: "column",
    zIndex: 0,
    height: 400,
    margin: 4,
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
  },
  postInnerInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginTop: 20,
  },
  innerInfo: {
    fontSize: 15,
    paddingLeft: 15,
  },
  extraInfo: {
    marginTop: 20,
    fontSize: 15,
    paddingLeft: 15,
  },
});

export default Post;
