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
  ScrollView,
  StatusBar,
  processColor,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../App";
import Nav from "../components/Nav";
import yes from "../images/yes.png";
import no from "../images/no.png";
import message from "../images/message.png";

function ReviewCharity({ navigation }) {
  const [charities, setCharities] = useState([]);
  const ip = "http://192.168.1.8:8000";

  useEffect(() => {
    console.log("Review Charity");
    getCharities();
  }, []);

  const getCharities = async () => {
    console.log("getting..");
    try {
      const response = await fetch(ip + "/getPendingCharities", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result) {
        setCharities(result);
        console.log(result);
      } else {
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      console.log("GET ERROR: " + e);
      Alert.alert("ERROR", "ERROR FETCHING");
    }
  };

  const decideCharity = async (value, id) => {
    console.log("sending charity res");
    try {
      const response = await fetch(ip + "/completeCharity", {
        method: "post",
        body: JSON.stringify({
          result: value,
          id: id,
        }),

        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result) {
        console.log("decided");
        getCharities();
        console.log("GOT CHARITIES");
      }
    } catch (e) {
      console.log("ERROR.... " + e);
      Alert.alert("ERROR:::::", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText} onPress={() => navigation.goBack()}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.titleText}>Pending Charities..</Text>

        {charities.map((item) => (
          <View style={styles.interestCont}>
            <View style={styles.innerInterestCont}>
              <Text style={styles.innerName}>{item.name}</Text>
              <Text style={styles.innerName}>{item.website}</Text>
              <Text style={styles.innerName}>Posted by: {item.user}</Text>
              <Text style={styles.innerPoints}>{item.number}</Text>
              <Text style={styles.innerPoints}>
                {item.long}, {item.lat}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.yesButton}
              onPress={() => decideCharity(true, item.id)}
            >
              <View style={styles.imageMsgInnerContainer}>
                <Image source={yes} style={styles.imageMsg} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.noButton}
              onPress={() => decideCharity(false, item.id)}
            >
              <View style={styles.imageMsgInnerContainer}>
                <Image source={no} style={styles.imageMsg} />
              </View>
            </TouchableOpacity>
          </View>
        ))}
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
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 10,
  },
  backText: {
    color: "navy",
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 20,
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
  interestCont: {
    flexDirection: "row",

    marginBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "grey",
  },
  imageCont: {
    padding: 15,
  },
  image: {
    height: 70,
    width: 70,
    borderRadius: 20,
  },
  innerInterestCont: {
    marginLeft: 10,
    justifyContent: "center",
  },
  innerName: {
    fontSize: 20,
    fontWeight: "500",
  },
  innerPoints: {
    fontSize: 20,
    fontWeight: "300",
    marginVertical: 4,
  },
  innerDist: {
    fontSize: 20,
    fontWeight: "300",
  },
  titleText: {
    fontSize: 30,
    fontWeight: "40",
    padding: 20,
    textAlign: "center",
  },
  yesButton: {
    // // padding: 25,
    flex: 1,
    flexDirection: "row",

    justifyContent: "flex-end",

    alignItems: "center",
  },
  noButton: {
    // // padding: 25,
    flex: 1,
    flexDirection: "row",

    justifyContent: "flex-end",
    paddingRight: 10,
    alignItems: "center",
  },
  imageMsgInnerContainer: {
    //   justifyContent: "center",
    //   alignItems:"center",
    //   backgroundColor:"red",
  },
  imageMsg: {
    height: 60,
    width: 60,
  },
});

export default ReviewCharity;
