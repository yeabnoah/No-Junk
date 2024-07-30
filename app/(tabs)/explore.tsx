import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { AntDesign } from "@expo/vector-icons";
import socialMediaPlatforms from "@/constant/social";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import get_the_first_n_words from "@/functions/trimWord";

interface Post {
  id: string;
  category: string;
  description: string;
  imageUrl: string;
  title: string;
}

const Explore = () => {
  const router = useRouter();
  const [category, setCategory] = useState("youtube");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      // Create a query to filter posts by category
      const postsQuery = query(
        collection(db, "posts"),
        where("category", "==", category)
      );

      // Fetch the posts matching the query
      const querySnapshot = await getDocs(postsQuery);
      const posts = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as Post),
        id: doc.id,
      }));

      setData(posts); // Set all posts initially
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts: ", error);
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Render Category FlatList
  const renderCategories = () => (
    <FlatList
      overScrollMode="never" // Disables the overscroll effect
      className="mt-2 ml-2 mb-3 py-2 rounded-l-xl"
      showsHorizontalScrollIndicator={false}
      data={socialMediaPlatforms}
      horizontal
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => setCategory(item.name)}
          className="mx-4 justify-center items-center"
        >
          {item.icon}
          <Text className="text-center font-outfit-light mt-2 text-emerald-500">
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );

  // Render Post FlatList item
  const renderPostItem = ({ item }: { item: Post }) => (
    <View className="border border-[#282834] p-2 bg-card rounded-[15] mx-5 mt-4">
      <Image source={{ uri: item.imageUrl }} className="h-36 rounded-xl" />
      <Text className="text-base text-emerald-500 mt-5 ">
        {get_the_first_n_words(item.description, 30)}
      </Text>

      <View className="flex justify-between items-end flex-row mt-2">
        <Text className=" text-lg my-2 text-right text-gray-500 font-outfit-medium">
          #{item.category}
        </Text>
        <TouchableOpacity
          onPress={() => router.push(`/postDetail/${item.id}`)}
          className="bg-[#1c1c24] border-[#2e2e3a] border-[0.9px] rounded-xl p-2 font-outfit-regular text-lg"
        >
          <Text className="text-emerald-500 font-outfit-regular">
            Get Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render List Header
  const renderHeader = () => (
    <View style={{ backgroundColor: "#17151c" }} className=" bg-background">
      <Text className=" text-2xl mt-5 mb-5 text-emerald-500 font-outfit-medium  mx-8">
        Discover Posts
      </Text>
      {renderCategories()}
    </View>
  );

  // Render List Footer
  const renderFooter = () => (
    <View className=" bg-background">
      {data.length === 0 && !loading ? (
        <View className="items-center mt-[15vh]">
          <Image
            source={require("../../assets/images/app/nopost.webp")}
            className="h-52 w-[50%] mb-10"
          />
          <Text className=" text-2xl text-emerald-500 font-outfit-regular">
            No posts available
          </Text>
        </View>
      ) : loading ? (
        <View className="flex flex-row mt-[40vh] items-center justify-center">
          <ActivityIndicator
            size="large"
            color="#10b981"
            className="text-4xl"
          />
        </View>
      ) : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        overScrollMode="never" // Disables the overscroll effect
        endFillColor={"#10b981"}
        className=" bg-background border-emerald-500"
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderPostItem}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchPosts}
            colors={["#000000"]} // for android
            tintColor={"#000000"}
            progressBackgroundColor={"#10b981"}
          />
        }
      />
    </KeyboardAvoidingView>
  );
};

export default Explore;
