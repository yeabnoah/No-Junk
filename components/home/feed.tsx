import { View, Text, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import trim_the_first_n_words from "@/functions/trimWord";

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
    <View className=" mb-10">
      <Text className=" text-2xl font-outfit-regular text-emerald-500 mx-5 mt-8">
        Feed
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
              paddingHorizontal: 3,
              paddingTop: 4,
              // paddingBottom: 10,
              borderRadius: 14,
              width: 250,
            }}
            key={item.id}
            className="  border-emerald-600 border mx-2"
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={{
                width: 240,
                height: 140,
                alignItems: "center",
                borderRadius: 10,
                borderColor: "#10b981",
                justifyContent: "center",
                marginHorizontal: "auto",
              }}
            />
            <View className=" flex flex-row justify-between mx-2 items-center gap-2">
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
            <Text className=" text-wrap text-white  font-outfit-light opacity-75 mt-1 mx-2">
              {trim_the_first_n_words(item.description, 30)}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default Feed;
