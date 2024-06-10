import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/EmptyState";
import { getUserPosts } from "../../lib/appWriteVideos";
import useAppWrite from "../../lib/useAppWrite";
import VideoCard from "../../components/VideoCard";
import { icons, images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import InfoBox from "../../components/InfoBox";
import { router } from "expo-router";
import { signOut } from "../../lib/appwriteUser";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const {
    data: posts,
    refetch,
    setData,
  } = useAppWrite(() => getUserPosts(user.$id));

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace("/sign-in");
  };

  const updateBookmarkedItemInList = (item, bookmarked) => {
    setData((data) => {
      return data.map((post) =>
        post.$id === item.$id ? { ...post, bookmarked } : post
      );
    });
  };

  const removeDeletedPostFromList = (item) => {
    setData((data) => {
      return data.filter((post) => post.$id !== item.$id);
    });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            savePressed={(bookmarked) =>
              updateBookmarkedItemInList(item, bookmarked)
            }
            deletePressed={() => removeDeletedPostFromList(item)}
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full items-center justify-center mt-6 mb-12 px-4">
            <TouchableOpacity
              activeOpacity={0.7}
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image
                source={icons.logout}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View className="w-16 h-16 rounded-lg border border-secondary justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles="mr-5"
                titleStyles="text-xl"
              />
              <InfoBox
                title="1.5K"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Video Found"
            subTitle="Create your first video."
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
