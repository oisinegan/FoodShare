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
  processColor,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../App";
import Nav from "../components/Nav";
import { StreamChat } from "stream-chat";
import noPic from "../images/noPic.png";
import {
  chatApiKey,
  chatUserId,
  chatUserName,
  chatUserToken,
} from "../config/chatConfig";
import { AppProvider } from "../../AppContext";
import { useAppContext } from "../../AppContext";
import { Channel, MessageList, MessageInput } from "stream-chat-expo";



function ChannelScreen({ route, navigation }) {
  // const { channel } = useAppContext();
  const { channel } = route.params;
  const [user, setUser] = useContext(Context);
  //console.log(channel)
  console.log(channel.state.members.name)
 const ip = 'http://192.168.1.8:8000';

  if(channel){
    for(const member in channel.state.members){
      print(channel.state.members[member].name)
    }
  
  }

  const chatClient = StreamChat.getInstance(chatApiKey);

  const [clientIsReady, setClientIsReady] = useState(false);


  const setupClient = async () => {
 


    try {
      const chatClient = StreamChat.getInstance(chatApiKey);
     // await chatClient.disconnectUser();

      await chatClient.connectUser(
          {
              id: user.name,
              name: user.name,
              //image: 'https://getstream.io/random_svg/?name=John',
          },
          chatClient.devToken(user.name),
      );
       
        console.log('Connected User ID from set up client:', chatClient.user.id);
     

        // Call the async function
        
        // console.log("IS CLIENT READY - "+ clientIsReady);
        setClientIsReady(true);
        // console.log("IS CLIENT READY - "+ clientIsReady);
         // console.log("Channels not filter:", channelsNoFilter);
        
        
        
        // connectUser is an async function. So you can choose to await for it or not depending on your use case (e.g. to show custom loading indicator)
        // But in case you need the chat to load from offline storage first then you should render chat components
        // immediately after calling `connectUser()`.
        // BUT ITS NECESSARY TO CALL connectUser FIRST IN ANY CASE.
      } catch (error) {
        if (error instanceof Error) {
          console.error(`An error occurred while connecting the user: ${error.message}`);
        }
      }
    
    };
    setupClient();

  
    const showAlert = async () => {
      Alert.alert('Complete share? ', 'This cannot be undone! Both parties will be awarded 5 share points ✅', [
        {
          text: 'Yes',
          onPress: () => completeShare(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel!'),
          style: 'cancel',
        },
      ]);

    }

    let otherUser = ""
    if(channel){
      console.log(channel.data.name)
      let indexOf_ = channel.data.name.indexOf("_");
      let indexOfSlash = channel.data.name.indexOf("/");
      otherUser = (channel.data.name).substring(indexOf_ +1, indexOfSlash);
      console.log(otherUser)
    }

    let indexOfAdId = channel.data.name.indexOf("/");
    let AdId = (channel.data.name).substring(indexOfAdId +1, channel.data.name.length);
    const completeShare = async () => {
      console.log('Yes cancel');
      
      console.log("ADID = "+ AdId);
      console.log(otherUser);
      console.log(user.name)

      const request = {
        AdId,
        otherUser,
        userN: user.name
      };
      try {
        console.log("CALLING COMPLETE SHARE")
        const response = await fetch(ip+"/completeShare", {
          method: "post",
          body: JSON.stringify(request),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        console.log("CS RES: ");
        console.log(result);
        if (result) {
          console.log(result)
          console.log("Writen to completed Share")
          deleteAd();
        } else {
          console.log("NO RESULT")
        }
      } catch (e) {
        console.log("FETCH ERROR: " + e);
        Alert.alert("ERROR", "ERROR");
      }
      
    }

    const deleteAd = async () => {
      console.log("INSIDE DELETE AD")
      try {
        const response = await fetch(ip+"/removeAd", {
          method: "post",
          body: JSON.stringify({AdId}),
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const result = await response.json();
        console.log("AFTER CALLING DELETE AD")
        console.log(result)
        if (result) {
          console.log("DELETED")
          
          addSharePoints();
        } else {
          console.log("NOT DELETED")
        }
      } catch (e) {
        console.log("FETCH ERROR: " + e);
        Alert.alert("ERROR", "ERROR");
      }
    }

    const addSharePoints = async () => {
      const request1 = {
   
        otherUser,
        userN: user.name
      };
   
      try {
        console.log("INSISDE SHARE POINTS")
        const response = await fetch(ip+"/addSharePoints", {
          method: "post",
          body: JSON.stringify(request1),
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const result = await response.json();
        console.log("RESULT CS: ")
        console.log(result);
        if (result) {
          console.log("ADDED")
          Alert.alert("5 share points added to each profile 🚀")
          const destroy = await channel.delete();
          console.log("DESTROY CHANNEL: "+ destroy);
          navigation.navigate('Landing');
        } else {
          console.log("NOT DELETED")
        }
      } catch (e) {
        console.log("FETCH ERROR: " + e);
        Alert.alert("ERROR", "ERROR");
      }
  }
    const deleteMessage = async () => {
        //Delete channel
    }
    

    if(clientIsReady && channel){
      return (

        <SafeAreaView style={styles.container}>
            <View style={styles.topNav}>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backText} onPress={() => navigation.goBack()}>
                Back
              </Text>
            </TouchableOpacity>
    
            <TouchableOpacity style={styles.completeButton}>
              <Text style={styles.backText} onPress={() => showAlert()}>
                Complete share
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoCon}>
            <View style={styles.imageCon}>
            
          <Image source={noPic} style={styles.image}/>
          </View>
          <Text style={styles.name}>{otherUser}</Text>
          </View>
    
          <Channel channel={channel}>
            <MessageList />
            <MessageInput />
          </Channel>
   
          <Nav />
      </SafeAreaView>
      );
    }
   else{
    return(       <SafeAreaView ><Text>loading</Text><Nav/></SafeAreaView>);
   }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginBottom: "45%",
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 10,
   
  },
  infoCon:{
    flexDirection:"row",
    backgroundColor:"lightgrey",
    justifyContent:"center",
    padding:10,
  },
  imageCon:{
   flex:1,
   paddingLeft:40,
   
  },  
  image:{
    width:50,
    height: 50,
    marginHorizontal:5,
  },
  name: {
    textAlign: "left",
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "600",
    color: "black",
    flex:3,
  },
  completeButton:{
    padding: 10,
  },
  backText: {
    color: "navy",
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 20,
  },

});

export default ChannelScreen;
