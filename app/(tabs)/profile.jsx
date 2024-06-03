import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../components/EmptyState';
import { getUserPosts } from '../../lib/appWriteVideos';
import useAppWrite from '../../lib/useAppWrite';
import VideoCard from '../../components/VideoCard';
import { icons, images } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import InfoBox from '../../components/InfoBox';
import { router } from 'expo-router';
import { signOut } from '../../lib/appwriteUser';

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppWrite(() => getUserPosts(user.$id));
  
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace('/sign-in');
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
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
                resizeMode='contain'
              />
            </TouchableOpacity>
            <View className="w-16 h-16 rounded-lg border border-secondary justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode='cover'
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles='mt-5'
              titleStyles="text-lg"
            />

            <View className="mt-5 flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles='mr-5'
                titleStyles="text-xl"
              />
              <InfoBox
                title="1.5K"
                subtitle="Followers"
                titleStyles="text-xl"
              />

            </View>
          </View>
        )
        }
        ListEmptyComponent={() => (
          <EmptyState
            title="No Video Found"
            subTitle="Create your first video."
          />
        )}
      />
    </SafeAreaView >
  )
}

export default Profile