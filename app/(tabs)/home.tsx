import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import React from "react";
import Header from "@/components/home/header";
import { StatusBar } from "expo-status-bar";
import Slider from "@/components/home/slider";
import Category from "@/components/home/category";
import Feed from "@/components/home/feed";
// import { ScrollView } from "react-native-gesture-handler";

export default function Home() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const user = useUser();
  // bg-[#1c1c24]
  return (
    <ScrollView className=" bg-background">
      <Header />
      <Category />
      <Feed />
      <Slider />
    </ScrollView>
  );
}
