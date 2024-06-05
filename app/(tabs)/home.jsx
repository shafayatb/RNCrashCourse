import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants';
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import { deletePosts, getAllPosts, getLatestPosts } from '../../lib/appWriteVideos';
import useAppWrite from '../../lib/useAppWrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';

const Home = () => {
  const { user } = useGlobalContext();

  const { data: posts, refetch: postRefecth, setData: setPostData } = useAppWrite(getAllPosts);

  const { data: latestPosts, refetch: latestRefetch, setData: setLatestPostData } = useAppWrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);


  const onRefresh = async () => {
    setRefreshing(true);
    await postRefecth();
    await latestRefetch();
    setRefreshing(false);
  }

  const deletePost = async (item) => {
    try {
      setPostData((data) => {
        return data.filter((post) => post.$id !== item.$id)
      })
      setLatestPostData((data) => {
        return data.filter((post) => post.$id !== item.$id)
      })
      await deletePosts(item)
      Alert.alert('Success', 'Post deleted sucessfully')
      //await postRefecth();
      await latestRefetch();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }

  }

  const deletePostConfirmation = (item) => {
    Alert.alert(
      "Are you sure?",
      "Are you sure you want to delete this post?",
      [
        { text: "Yes", onPress: async () => await deletePost(item) },
        { text: "Cancel" }
      ]
    )
  }


  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            deletePressed={() => deletePostConfirmation(item)}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome back,
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode='contain'
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>

              <Trending
                posts={latestPosts ?? []}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Video Found"
            subTitle="Be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  )
}

export default Home