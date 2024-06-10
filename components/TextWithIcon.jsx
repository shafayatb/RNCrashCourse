import { View, Text, Image } from "react-native";
import React from "react";

const TextWithIcon = ({ icon, title }) => {
  return (
    <View className="flex-row items-center justify-center p-2 ml-3">
      <Image source={icon} className="w-5 h-5" resizeMode="contain" />
      <Text className={`text-base text-gray-100 font-pregular flex-1 ml-2`}>
        {title}
      </Text>
    </View>
  );
};

export default TextWithIcon;
