import {
    StyleSheet,
    Pressable,
    TouchableOpacity,
    KeyboardAvoidingView,
    Text,
    SafeAreaView,
    ActivityIndicator,
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
  import { Context,LocationContext } from "../../App";
  import Nav from "../components/Nav";
  import noPic from "../images/noPic.png";
  import message from "../images/message.png";
  import * as Location from "expo-location";
  import { StreamChat } from "stream-chat";
  import { chatApiKey } from "../config/chatConfig";
  import { SelectList } from "react-native-dropdown-select-list";
  import DateTimePicker from "@react-native-community/datetimepicker";
  import postIcon from "../images/postIcon.png";
  
  function AdInterest({ route, navigation }) {
    const [user, setUser] = useContext(Context);

    const [loc, setLoc] = useContext(LocationContext);
    const [posting, setPosting] = useState(false);
    const { params } = route;
    console.log("PARAMS")
    const ad = params;
    console.log(ad);
    const [info, setInfo] = useState(ad);
    console.log("INFO")
    console.log(info)
    const ip = "http://192.168.1.8:8000";

        //errors
        const [itemErr, setItemErr] = useState("");
        const [brandErr, setBrandErr] = useState(" ");
        const [sizeErr, setSizeErr] = useState(" ");
        const [quantErr, setQuantErr] = useState(" ");
        const [postToErr, setPostToErr] = useState(" ");
        const [extraInfoErr, setExtraInfoErr] = useState("");
       
    
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
    

  const units = [
    { key: "Kg", value: "Kg" },
    { key: "G", value: "G" },
    { key: "L", value: "L" },
    { key: "Ml", value: "Ml" },
  ];
   

  const handleChange = (name, val) => {
    console.log(info)
    setInfo((prev) => {
      return { ...prev, [name]: val.trim() };
    });

    // (info);
  };

  const handleSubmit = async () => {
    setPosting(true);
   
    let noCorrectInputs = validate();


    console.log(noCorrectInputs);

    if(noCorrectInputs !== 5){
      Alert.alert("Fill out all fields!", "Correct fields: "+ noCorrectInputs + "/5");
      setPosting(false);
      return;
    }

    try {
        console.log("ITEM INFORMATION")
        console.log(info);
        const response = await fetch(ip + "/editPost", {
        method: "post",
        body: JSON.stringify({info }),
        headers: {
            "Content-Type": "application/json",
          },
      });

      const result = await response.json();

      if (result) {
        setPosting(false);
        console.log(result)
        
        navigation.navigate("ExtendedProfile");
      } else {
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      Alert.alert("ERROR", "ERROR: " + e);
    }
  };
  const showAlert = async () => {
    Alert.alert(
      "Delete post? ",
      "This cannot be undone!",
      [
        {
          text: "Yes",
          onPress: () => deletePost(),
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel!"),
          style: "cancel",
        },
      ]
    );
  };

  const deletePost = async () => {
    console.log("Delete post");
    try {
        const response = await fetch(ip + "/removeAd", {
        method: "post",
        body: JSON.stringify({ AdId:info.id }),
        headers: {
            "Content-Type": "application/json",
          },
      });

      const result = await response.json();

      if (result) {
        console.log(result)
        navigation.navigate("ExtendedProfile");
      } else {
        Alert.alert("ERROR", "Error deleting post");
      }
    } catch (e) {
      Alert.alert("ERROR", "ERROR: " + e.message);
    }
  }
  
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.topNav}>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backText1} onPress={() => navigation.goBack()}>
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton}>
              <Text style={styles.deleteText1} onPress={() => showAlert()}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.titleText}>Edit Post</Text>
            <Text style={styles.label}>Item name</Text>
            <TextInput
            value={info.foodName}
          placeholder="Item"
          style={styles.innerInfo}
          onChangeText={(val) => handleChange("foodName", val)}
        />
        <Text style={styles.errorMsg}>{itemErr}</Text>
        <Text style={styles.label}>Brand</Text>
        <TextInput
          placeholder="Brand"
          value={info.brand}
          style={styles.innerInfo}
          onChangeText={(val) => handleChange("brand", val)}
        />
          <Text style={styles.errorMsg}>{brandErr}</Text>

    
    <Text style={styles.label}>Size</Text>
        <View style={styles.sizeCon}>
           
          <TextInput
            value={info.size.toString()}
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
        <Text style={styles.label}>Quantity</Text>
        <TextInput
        value={info.quant.toString()}
          placeholder="Quantity"
          // keyboardType={Device.isAndroid ? "numeric" : "number-pad"}
          keyboardType={"number-pad"}
          
          style={styles.innerInfo}
          onChangeText={(val) => handleChange("quant", val)}
        />
          <Text style={styles.errorMsg}>{quantErr}</Text>
        <Text style={styles.label}>Extra Information</Text>
        <TextInput
          placeholder="Extra Information"
          multiline
          value={info.extraInfo}
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
            <View style={styles.buttonCon}>
            <TouchableOpacity style={styles.completeButton}>
              <Text style={styles.backText}  onPress={handleSubmit}>
                Complete
              </Text>
            </TouchableOpacity>
            </View>
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
    topNav: {
   
      flexDirection: "row",
      justifyContent: "space-between",
    },
    backButton: {
      padding: 10,
    },
    deleteButton:{
        padding: 10,
        backgroundColor:"red",
        borderRadius:20,
        marginRight:15,
    },
    deleteText1: {
        color: "white",
        textAlign: "center",
        fontSize: 20,
        //marginHorizontal: 20,
      },
    backText1: {
      color: "navy",
      textAlign: "center",
      fontSize: 20,
      marginHorizontal: 20,
    },
    completeButton: {
        backgroundColor: "blue",
        borderRadius: 50,
   
  
        padding:17,
      },
      backText: {
        color: "white",
        textAlign: "center",
        fontSize: 20,
      },
    contentContainer: {
      flex: 1,
      backgroundColor: "white",
    },
    titleText: {
      fontSize: 30,
      
      fontWeight: "40",
      paddingHorizontal: 20,
      textAlign: "center",
    },
    innerInfo: {
        fontSize: 15,
        marginVertical:15,
        marginHorizontal:10,
        paddingLeft: 15,
        borderWidth: 1,
        padding: 12,
        borderColor: "grey",
        marginBottom: 10,
        borderRadius: 10,
      },
      sizeCon: {
        flexDirection: "row",
        marginVertical:15,
        marginHorizontal:10,
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
      label:{
        fontSize:20,
        fontWeight:"400",
        marginTop:5,
        marginLeft:10,
      },
      innerInfoExtra: {
        fontSize: 15,
        paddingLeft: 15,
        marginVertical:15,
        marginHorizontal:10,
        borderWidth: 1,
        padding: 12,
        borderColor: "grey",
        marginVertical: 10,
        borderRadius: 10,
        maxHeight: 160,
      },
      buttonCon:{
        flex:1,
        padding:20,
        alignItems:'center',
        justifyContent:"center",
  
      },
      errorMsg: {
        color: "red",
        fontSize:15,
        paddingLeft: 10,
        marginTop: 2,
        marginBottom: 10,
      },
   
  });
  
  export default AdInterest;
  