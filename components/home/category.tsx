import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { ReactNode } from "react";
import { AntDesign } from "@expo/vector-icons";
import socialMediaPlatforms from "@/constant/social";
import { useRouter } from "expo-router";

// Define the type for your data
interface CategoryData {
  id: number;
  name: string;
  iconName: string;
  icon: ReactNode; //
}

const Category = () => {
  const router = useRouter();
  return (
    <View className="">
      {/* <View className=" mt-3 flex justify-between flex-row items-center mr-5">
        <Text className="text-2xl font-outfit-medium text-emerald-500 mx-5 ">
          Post Category
        </Text>

        <Text className=" text-emerald-500 underline underline-offset-2  font-outfit-regular text-lg mt-2">
          View All
        </Text>
      </View> */}

      <FlatList
        className="mt-2 ml-2 py-2 rounded-l-xl"
        showsHorizontalScrollIndicator={false}
        data={socialMediaPlatforms}
        horizontal
        keyExtractor={(item) => item.id.toString()} // Use keyExtractor for unique keys
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              router.push(`/posts/${item.name}`);
            }}
            className=" mx-4 justify-center items-center"
          >
            {item.icon}
            <Text className="text-center font-outfit-light mt-2 text-emerald-500">
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Category;
