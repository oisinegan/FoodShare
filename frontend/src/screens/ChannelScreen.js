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

  useEffect(() => {
    channel.watch();
  }, []);
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


    if(clientIsReady && channel){
      return (

        <SafeAreaView style={styles.container}>
            <View style={styles.topNav}>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backText} onPress={() => navigation.goBack()}>
                Back
              </Text>
            </TouchableOpacity>
    
            <Text style={styles.topNavTitle}>Name</Text>

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
    marginBottom: "27%",
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "center",
  },
  backButton: {
    padding: 10,
    paddingRight: 30,
    marginLeft: -120,
  },
  backText: {
    color: "navy",
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 20,
  },
  topNavTitle: {
    textAlign: "center",
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "600",
    color: "black",
  },
});

export default ChannelScreen;