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
import Nav from "../components/Nav";

function Register({ navigation }) {
  const [info, setInfo] = useState([{}]);
  const ip = "http://192.168.1.8:8000";
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState(" ");
  const [passwordErr, setPasswordErr] = useState(" ");

  const validate = () => {
    let noCorrectInputs = 0;
     //Item
     if (info.name == "") {
      setNameErr("Username is empty");
    }else if (info.name == undefined) {
      setNameErr("Username  is empty");
    }  else if (info.name.length < 5) {
      setNameErr("Provide more than 5 characters!");
    } else if (info.name.length >= 15) {
      setNameErr("Too many characters! (Max 15 characters)");
    } else if (info.name.indexOf(" ") !== -1) {
      setNameErr("The username cannot contain spaces!");
    } else if (info.name.indexOf("_") !== -1) {
      setNameErr("The username cannot have an underscore!");
    }  else {
      noCorrectInputs++;
      setNameErr("");
    }

      //Email
       if (info.email == "") {
        setEmailErr("Enter an email!");
      }else if (info.email == undefined) {
        setEmailErr("Enter an email!");
      }else if (info.email.indexOf("@") === -1) {
        setEmailErr("Enter a valid email!");
      } else if (info.email.indexOf(".") === -1) {
        setEmailErr("Enter a valid email!");
      } else if (info.email.length <5) {
        setEmailErr("Enter a valid email!");
      }else {
        noCorrectInputs++;
        setEmailErr("");
      }


    //Password
    if (info.password == "") {
      setPasswordErr("Password field is empty!");
    } else if (info.password == undefined) {
      setPasswordErr("Password field is empty!");
    }else if (info.password.length < 6) {
      setPasswordErr("password must be longer than 6 characters!");
    } else if (upperCaseTest(info.password) == false) {
      setPasswordErr("Password must contain a capital!");
    } else if (numberTest(info.password) == false) {
      setPasswordErr("Password must contain a number!");
    } else {
      noCorrectInputs++;
      setPasswordErr("");
    }

  
    return noCorrectInputs;
  }
   //Specific tests - methods return true/false
   function upperCaseTest(string) {
    //If string contains at least one  Upper case letter
    return /[A-Z]/.test(string);
  }
  function numberTest(string) {
    //If string contains at least one number
    return /[1-9]/.test(string);
  }
  function validEmail(string) {
    var res1 = /[@]/.test(string);
    var res2 = /[.]/.test(string);

    if (res1 && res2) {
      return true;
    }
    return false;
  }

  const handleChange = (name, val) => {
    setInfo((prev) => {
      return { ...prev, [name]: val.trim() };
    });
    info;
  };

  const handleSubmit = async () => {
    let noCorrectInputs = validate();

    console.log(noCorrectInputs);

    if(noCorrectInputs !== 3){
      Alert.alert("Fill out all fields!", "Correct fields: "+ noCorrectInputs + "/3");
      return;
    }

    try {
      info.email = info.email.toString().toLowerCase();
      const response = await fetch(ip + "/Register", {
        method: "post",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result) {
        navigation.navigate("Login");
      } else {
        Alert.alert("ERROR", "ERROR: USER ALREADY EXISTS");
      }
    } catch (e) {
      "FETCH ERROR: " + e;
      Alert.alert("ERROR", "ERROR");
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <View style={styles.innerContainer}>
          <View style={styles.conBorder}>
            <TextInput
              name="name"
              placeholder="Username"
              style={styles.input}
              onChangeText={(val) => handleChange("name", val)}
            />
              <Text style={styles.errorMsg}>{nameErr}</Text>
            <TextInput
              name="email"
              placeholder="Email"
              style={styles.input}
              onChangeText={(val) => handleChange("email", val)}
            />
         <Text style={styles.errorMsg}>{emailErr}</Text>
            <TextInput
              secureTextEntry={true}
              placeholder="Password"
              name="password"
              style={styles.input}
              onChangeText={(val) => handleChange("password", val)}
            />
             <Text style={styles.errorMsg}>{passwordErr}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.text}>Register</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 20 }}>
              Already have an account?{" "}
              <Text
                style={{
                  textDecorationLine: "underline",
                  color: "rgba(10, 10, 50.2, 0.8)",

                  fontSize: 20,
                }}
                onPress={() => navigation.navigate("Login")}
              >
                Login
              </Text>
            </Text>
          </View>
        </View>
      </View>
      <Nav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafaf9",
    height: "94.5%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "25%",
  },
  innerContainer: {
    flex: 1,
    width: "90%",
  },
  conBorder: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 25,
    padding: 15,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 20,
    paddingBottom: 25,
  },
  input: {
    borderWidth: 2,
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    borderColor: "black",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    marginBottom: 25,
    marginTop:10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  errorMsg: {
    color: "red",
    fontSize:15,
    paddingLeft: 10,
    marginTop: 2,
    marginBottom: 10,
  },
});

export default Register;
