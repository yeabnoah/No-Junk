import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Create a query to filter posts by category
        const postsQuery = query(
          collection(db, "posts"),
          where("category", "==", category)
        );

        // Fetch the posts matching the query
        const querySnapshot = await getDocs(postsQuery);
        const posts = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Post[];

        setData(posts);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, [category]);

  return (
    <View className="min-h-screen bg-background px-5">
      <View className="flex h-16 flex-row items-center gap-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-sharp" size={26} color="#10b981" />
        </TouchableOpacity>
        <Text className="text-2xl font-medium text-emerald-500 font-outfit-regular">
          {category} post list
        </Text>
      </View>

      <View>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View className=" border border-emerald-500 p-2 bg-card rounded-xl mx-auto mt-4">
              <Image
                source={{ uri: item.imageUrl }}
                className="h-32 rounded-xl"
              />
              <Text className=" text-base text-emerald-500 mt-5">
                {item.description}
              </Text>

              <View className=" flex justify-start items-end">
                <TouchableOpacity className=" bg-emerald-500 rounded-xl p-2 font-outfit-regular text-lg">
                  <Text className="">Get Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}
