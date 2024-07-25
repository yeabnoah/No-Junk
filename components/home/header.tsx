import { View, Text, Image, TextInput } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { AntDesign } from "@expo/vector-icons";

export default function Header() {
  const { user } = useUser();
  return (
    <View className=" bg-[#17151c] rounded-b-3xl">
      <View className=" mt-18 mx-5 flex flex-row gap-3 items-center mt-5">
        <Image
          className=" border-emerald-500 border-2 h-14 w-14 rounded-full"
          source={{ uri: user?.imageUrl }}
        />
        <View className="">
          <Text className=" font-outfit-regular text-xl text-emerald-500">
            Welcome,
          </Text>
          <Text className=" font-outfit-semibold text-2xl  text-emerald-500">
            {user?.fullName}
          </Text>
        </View>
      </View>

      <View className=" flex flex-row border-opacity-20  border-emerald-500 border-[.2px] items-center gap-3 mx-8 bg-[#17151c] mb-10 mt-5 rounded py-2">
        <AntDesign
          name="search1"
          size={20}
          color={"#10b981"}
          className=" ml-2"
        />
        <TextInput
          placeholderTextColor="gray"
          className=" bg-[#17151c] rounded-md text-emerald-500  text-xl font-outfit-regular w-[80%]"
          placeholder="what are you looking for .."
        />
      </View>
    </View>
  );
}
