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
  Modal,
  CheckBox,
  StatusBar,
  processColor,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../App";
import Nav from "../components/Nav";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import whiteicon from "../images/whiteicon.png";
import plus from "../images/plus.png";
import Checkbox from 'expo-checkbox';

function Charity({ navigation }) {
  const [user, setUser] = useContext(Context);
  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [info, setInfo] = useState([{}]);
  const [items, setItems] = useState([]);
  const ip = 'http://192.168.1.8:8000';


  const handleChange = (name, val) => {
    setInfo((prev) => {
      return { ...prev, [name]: val.trim() };
    });
    (info);
  };

  const handleSubmit = async () => {
    let long = location.coords.longitude;
    let lat = location.coords.latitude;
    // let lat = 53.3339148;
    // let long = -6.2910678;
    //Trim to 6 decimal points
    long = long.toFixed(6);
    lat = lat.toFixed(6);

    let userId = user.id;


    if (
      !info.name ||
      !info.phone ||
      !info.web 
    ) {
      Alert.alert("ERROR", "Fill in all fields!");
      return;
    }
    if (
      !isChecked
    ) {
      Alert.alert("ERROR", "We need your location to register a charity!");
      return;
    }
    if (!long || !lat) {
      Alert.alert("Location error!", "Could not find location! Try again!");
      return;
    }

    console.log(info)
    console.log(long)
    console.log(lat)

    infoWithLoc = {...info,lat,long,userId};
    console.log(infoWithLoc);
   

    try {
      const response = await fetch(ip+"/registerCharity", {
        method: "post",
        body: JSON.stringify(infoWithLoc),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result) {
        setModalVisible(!modalVisible)
      } else {
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      console.log("FETCH ERROR: " + e);
      Alert.alert("ERROR", "ERROR");
    }
  };

  const getUserLoc = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    
  };

  const fetchCharity = async () => {
    try {
      const response = await fetch(ip+"/getCharity", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result) {
        setItems(result);
        console.log(result)
      } else {
        Alert.alert("ERROR", "ERR");
      }
    } catch (e) {
      console.log("GET ERROR: " + e);
      Alert.alert("ERROR", "ERROR FETCHING");
    }
  };

  useEffect(()=>{
    getUserLoc();
    fetchCharity();
  },[])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
      <Text style={styles.title}>Food Charity</Text>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
   
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Register a Charity!</Text>
            <TextInput
           
            placeholder="Name"
            name="name"
            style={styles.input}
            placeholderTextColor="grey"
            onChangeText={(val) => handleChange("name", val)}
          />
        <TextInput
           placeholder="Phone Number"
           name="phone"
           keyboardType={"number-pad"}
           style={styles.input}
           placeholderTextColor="grey"
           onChangeText={(val) => handleChange("phone", val)}
         />
        
          <TextInput
           placeholder="Website"
           name="web"
           style={styles.input}
           placeholderTextColor="grey"
           onChangeText={(val) => handleChange("web", val)}
         />

  <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? '#4630EB' : undefined}
        />
        <Text style={styles.paragraph}>Use my location</Text>
      </View>

          <Pressable
              style={[styles.button1, styles.buttonClose]}
              onPress={() => handleSubmit()}>
              <Text style={styles.textStyle}>Submit</Text>
            </Pressable>

            <Pressable
              style={[styles.button2, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {location  ? (
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.2922,
                longitudeDelta: 0.2421,
              }}
              provider={MapView.PROVIDER_GOOGLE}
            >
              {items.map((item, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: item.lat,
                    longitude: item.long,
                  }}
                >
                  <Callout>
                    <View style={styles.map_postContainer}>
                    
                        

                        <Text style={styles.innerInfo}>Charity: {item.name}</Text>
                        <Text style={styles.innerInfo}>Phone: {item.number}</Text>
                        <Text style={styles.innerInfo}>Website: {item.website}</Text>

                       
                  
                    </View>
                    
                  </Callout>
                </Marker> 
              ))}
            
           
            </MapView>
          ) : (
            <Text>Loc not ready</Text>
          )}
              <TouchableOpacity
          style={styles.addContainer}
           onPress={()=>setModalVisible(true)}
        >
          <Image source={plus} style={styles.addButton} />
        </TouchableOpacity>
       
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
    backgroundColor: "white",
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 10,
    paddingBottom: 10,
  },
  addContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  addButton: {
    
    width: 70,
    height: 70,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FAF9F6',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button1: {
    borderRadius: 20,
    marginTop:10,
    padding: 15,
    elevation: 2,
    backgroundColor:"green",
  },
  button2: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop:15,
    backgroundColor:"red",
  },
  
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize:20,
    textAlign: 'center',
  },

  input: {
    borderWidth: 2,
    borderRadius: 15,
    padding: 5,
    width: 200,
    marginVertical: 10,
    borderColor: "black",
    
  },

  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
    padding:10,
  },


  map_postContainer:{
    flex:1,
    
    height: "auto",
    overflow: "visible",
  },

  innerInfo: {
    fontSize: 15,
  },
});

export default Charity;
