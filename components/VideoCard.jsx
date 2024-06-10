import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import TextWithIcon from "../components/TextWithIcon";
import { ResizeMode, Video } from "expo-av";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { useGlobalContext } from "../context/GlobalProvider";
import { bookmarkPosts, deletePosts } from "../lib/appWriteVideos";

const VideoCard = React.memo(
  ({
    video: {
      $id: videoID,
      title,
      thumbnail,
      thumbnailID,
      videoFileID,
      video,
      bookmarked,
      creator: { $id, username, avatar },
    },
    savePressed,
    deletePressed,
  }) => {
    const { user } = useGlobalContext();
    const [play, setPlay] = useState(false);

    const savePost = async () => {
      try {
        let bookmarkedUsers = bookmarked;
        let msg = "";
        if (bookmarkedUsers.some((usr) => usr === user.$id)) {
          bookmarkedUsers = bookmarkedUsers.filter((usr) => usr !== user.$id);
          msg = "Removed Bookmark";
        } else {
          bookmarkedUsers.push(user.$id);
          msg = "Bookmarked";
        }
        savePressed(bookmarkedUsers);

        await bookmarkPosts(bookmarkedUsers, videoID, user.$id);

        Alert.alert("Success", msg);
      } catch (error) {
        Alert.alert("Error", "Failed to save post");
      }
    };

    const deletePost = async () => {
      try {
        deletePressed();
        await deletePosts(thumbnailID, videoFileID, videoID);
        Alert.alert("Success", "Post deleted sucessfully");
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    };

    const deletePostConfirmation = () => {
      Alert.alert(
        "Are you sure?",
        "Are you sure you want to delete this post?",
        [
          { text: "Yes", onPress: async () => await deletePost() },
          { text: "Cancel" },
        ]
      );
    };

    return (
      <View className="flex-col items-center px-4 mb-14">
        <View className="flex-row gap-3 items-start">
          <View className="justify-center items-center flex-row flex-1">
            <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
              <Image
                source={{ uri: avatar }}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
            </View>
            <View className="justify-center flex-1 ml-3 gap-y-1">
              <Text
                className="text-white font-psemibold text-sm"
                numberOfLines={1}
              >
                {title}
              </Text>
              <Text
                className="text-xs text-gray-100 font-pregular"
                numberOfLines={1}
              >
                {username}
              </Text>
            </View>
          </View>
          <View className="pt-2">
            <Menu>
              <MenuTrigger>
                <Image
                  source={icons.menu}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    backgroundColor: "#1E1E2D",
                    borderRadius: 10,
                  },
                }}
              >
                <MenuOption onSelect={() => savePost()}>
                  <TextWithIcon
                    icon={icons.bookmark}
                    title={
                      bookmarked.some((usr) => usr === user?.$id)
                        ? "UnSave"
                        : "Save"
                    }
                  />
                </MenuOption>
                {user?.$id === $id ? (
                  <MenuOption onSelect={() => deletePostConfirmation()}>
                    <TextWithIcon icon={icons.deleteIcon} title="Delete" />
                  </MenuOption>
                ) : (
                  <></>
                )}
              </MenuOptions>
            </Menu>
          </View>
        </View>

        {play ? (
          <Video
            source={{ uri: video }}
            className="w-full h-60 rounded-xl mt-3 "
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                setPlay(false);
              }
            }}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
            onPress={() => setPlay(true)}
          >
            <Image
              source={{ uri: thumbnail }}
              className="w-full h-full rounded-xl mt-3"
              resizeMode="cover"
            />

            <Image
              source={icons.play}
              className="w-12 h-12 absolute"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

export default VideoCard;
