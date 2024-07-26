import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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

export default function PostType() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
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

      setData(posts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts: ", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  return (
    <View className="min-h-screen bg-background px-5">
      <View className="flex h-16 flex-row items-center gap-5 px-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-sharp" size={24} color="#10b981" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-emerald-500 font-outfit-regular">
          {category}
        </Text>
      </View>

      {data.length > 0 && !loading ? (
        <FlatList
          refreshing={loading}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchPosts}
              colors={["#000000"]} // for android
              tintColor={"#000000"}
              progressBackgroundColor={"#10b981"}
            />
          }
          onRefresh={fetchPosts}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="border border-[#282834] p-2 bg-card rounded-[15] mx-auto mt-4">
              <Image
                source={{ uri: item.imageUrl }}
                className="h-32 rounded-xl"
              />
              <Text className="text-base text-emerald-500 mt-5">
                {get_the_first_n_words(item.description, 30)}
              </Text>

              <View className="flex justify-start items-end mt-2">
                <TouchableOpacity
                  onPress={() => {
                    router.push(`/postDetail/${item.id}`);
                  }}
                  className="bg-[#1c1c24] border-[#2e2e3a] border-[0.9px]  rounded-xl p-2 font-outfit-regular text-lg"
                >
                  <Text className=" text-emerald-500 font-outfit-regular">
                    Get Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : loading ? (
        <View className=" flex flex-row mt-[40vh] items-center justify-center">
          <ActivityIndicator
            size="large"
            color="#10b981"
            className=" text-4xl"
          />
        </View>
      ) : (
        <View className="min-h-screen items-center mt-[25vh]">
          <Image
            source={require("../../assets/images/app/nopost.webp")}
            className=" h-60 w-[80%] mb-10"
          />
          <Text className="text-2xl text-emerald-500 font-outfit-regular">
            No posts available
          </Text>
        </View>
      )}
    </View>
  );
}
