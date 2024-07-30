import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Header from "@/components/home/header";
import { StatusBar } from "expo-status-bar";
import Slider from "@/components/home/slider";
import Category from "@/components/home/category";
import Feed from "@/components/home/feed";

export default function Home() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const user = useUser();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Add your refresh logic here, for example:
    // await fetchData(); // Fetch new data or perform any other action
    setRefreshing(false);
  }, []);

  console.log("hello");

  return (
    <ScrollView
      style={{ backgroundColor: "#17151c" }}
      overScrollMode="never"
      className="bg-background"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#000000"]} // for android
          tintColor={"#000000"}
          progressBackgroundColor={"#10b981"}
        />
      }
    >
      <Header />
      <Category />
      <Feed />
      <Slider />
    </ScrollView>
  );
}
