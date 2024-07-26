import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import get_the_first_n_words from "@/functions/trimWord";
import { useRouter } from "expo-router";

// Define the type for your data
interface SliderData {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  description: string;
}

const Feed = () => {
  const [data, setData] = useState<SliderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const docsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SliderData[];
        setData(docsData);
      } catch (err) {
        setError(true);
        // setErrorText(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {errorText}</Text>
      </View>
    );
  }

  return (
    <View className="">
      <Text className=" text-2xl font-outfit-medium px-1 text-emerald-500 mx-5 mt-8">
        New Posts
      </Text>

      <FlatList
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

export default Feed;
