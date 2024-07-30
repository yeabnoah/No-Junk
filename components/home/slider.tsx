import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import get_the_first_n_words from "@/functions/trimWord";
import { useRouter } from "expo-router";

// Define the type for your data
interface Review {
  comment: string;
  email: string;
  imageUrl: string;
  name: string;
  rate: number;
  title: string;
}

interface Post {
  id: string;
  author: string;
  authorId: string;
  category: string;
  createdAt: string;
  description: string;
  imageUrl: string;
  title: string;
  link: string;
  review: Review[];
}

const Slider: React.FC = () => {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const fetchData = async () => {
    try {
      // Fetch all posts (or a large enough sample if there are many posts)
      const postsQuery = query(collection(db, "posts"));
      const querySnapshot = await getDocs(postsQuery);

      // Map through the docs and include the length of the reviews array
      const docsData = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Post;
        return {
          id: doc.id,
          ...data,
          reviewCount: (data.review && data.review.length) || 0, // Default to 0 if review is not present
        };
      });

      // Sort the posts by reviewCount in descending order and take the top 10
      const sortedData = docsData
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, 10);

      // Update state with the sorted data
      setData(sortedData);
    } catch (err) {
      console.error(err);
      // setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="flex flex-row justify-center items-center my-16">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex flex-row justify-center items-center my-16">
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View className="flex flex-row justify-center items-center my-16">
        <Text className=" text-2xl text-emerald-500 font-outfit-regular">
          No popular posts available.
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-5 mb-5">
      <Text className="text-2xl font-outfit-medium text-emerald-500 mx-5 mb-5">
        Popular Posts
      </Text>
      <FlatList
        overScrollMode="never" // Disables the overscroll effect
        className=" mt-3 ml-2"
        showsHorizontalScrollIndicator={false}
        data={data}
        horizontal={true}
        renderItem={({ item }) => (
          <View
            style={{
              // backgroundColor: "#1f2937",
              paddingHorizontal: 0,
              paddingTop: 3,
              borderRadius: 14,
              width: 250,
              // borderColor: "gray",
            }}
            key={item.id}
            className="border-opacity-50 border-[#1e1e26] border mx-2"
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={{
                width: 240,
                height: 140,
                alignItems: "center",
                borderRadius: 10,
                justifyContent: "center",
                marginHorizontal: "auto",
              }}
            />
            <TouchableOpacity
              onPress={() => {
                router.push(`/postDetail/${item.id}`);
              }}
            >
              <View className=" flex flex-row justify-between mx-2 items-center gap-2 ">
                <Text className=" items-start text-emerald-500 font-outfit-semibold mt-2 mb-1 text-xl text-wrap">
                  {item.title}
                </Text>

                <Text
                  style={{
                    backgroundColor: "#10b981",
                    borderRadius: 20,
                    paddingHorizontal: 5,
                  }}
                  className="  text-slate-900 font-outfit-semibold mt-2 text-xs"
                >
                  {item.category}
                </Text>
              </View>
              <Text className=" text-wrap text-white  font-outfit-light opacity-75 mt-1 mx-2 mb-3">
                {get_the_first_n_words(item.description, 20)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default Slider;
