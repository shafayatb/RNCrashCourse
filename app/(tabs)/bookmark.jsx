import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { getBookmarkedPosts } from "../../lib/appWriteVideos";
import useAppWrite from "../../lib/useAppWrite";
import VideoCard from "../../components/VideoCard";
import { useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const { query } = useLocalSearchParams();
  const {
    data: posts,
    refetch,
    setData,
  } = useAppWrite(() => getBookmarkedPosts(user.$id));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const updateBookmarkedItemInList = (item) => {
    setData((data) => {
      return data.filter((post) => post.$id !== item.$id);
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
            savePressed={(bookmarked) => updateBookmarkedItemInList(item)}
            deletePressed={() => removeDeletedPostFromList(item)}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Bookmark Found"
            subTitle="No post is bookmarked yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;
