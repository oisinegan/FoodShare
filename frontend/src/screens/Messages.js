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
import { ChannelList } from "stream-chat-expo";
import { ResizeMode } from "expo-av";

function Messages({ navigation }) {
  const [user, setUser] = useContext(Context);
  const chatClient = StreamChat.getInstance(chatApiKey);
  console.log("IS CONNECTED: " + chatClient.wsConnection.connectionID);

  const filters = {
    members: {
      $in: [user.name],
    },
  };

  const sort = {
    last_message_at: -1,
  };

  const { setChannel } = useAppContext();
  const [clientIsReady, setClientIsReady] = useState(false);

  const setupClient = async () => {
    try {
      console.log("WAITING 1");
      const chatClient = StreamChat.getInstance(chatApiKey);
      // await chatClient.disconnectUser();

      await chatClient.connectUser(
        {
          id: user.name,
          name: user.name,
          //image: 'https://getstream.io/random_svg/?name=John',
        },
        chatClient.devToken(user.name)
      );

      console.log("Connected User ID from set up client:", chatClient.user.id);

      // Call the async function
      try {
        const channels = await chatClient.queryChannels(filters, sort);
        // console.log("Channels:", channels);

        console.log("IS CLIENT READY - " + clientIsReady);
        setClientIsReady(true);
        console.log("IS CLIENT READY - " + clientIsReady);
        // console.log("Channels not filter:", channelsNoFilter);
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `An error occurred while connecting the user: ${error.message}`
        );
      }
    }
  };
  setupClient();

  if (clientIsReady) {
    return (
      <SafeAreaView style={styles.container}>
        <ChannelList
          styles={{ marginTopTop: 4000 }}
          filters={filters}
          sort={sort}
          onSelect={(channel) => {
            console.log("CHANNEL SELETEDL: ");
            console.log(channel);
            console.log("************************************************");
            setChannel(channel);
            navigation.navigate("ChannelScreen", { channel: channel });
          }}
        />

        <Nav />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Text>false</Text>
        <Nav />
      </SafeAreaView>
    );
  }
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
});

export default Messages;
