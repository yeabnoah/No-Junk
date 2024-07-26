import { View, Text, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";

// Define the type for your data
interface SliderData {
  id: string;
  name: string;
  imageUrl: string;
}

const Slider: React.FC = () => {
  const [data, setData] = useState<SliderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "slider"));
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
    <View className=" mt-5 mb-5">
      <Text className=" text-2xl font-outfit-medium text-emerald-500 mx-5 mb-5">
        Popular Posts
      </Text>

      {/* <View></View> */}
      <FlatList
        className=" px-1 mx-2"
        showsHorizontalScrollIndicator={false}
        data={data}
        horizontal={true}
        renderItem={({ item }) => (
          <View
            key={item.id}
            style={{
              width: 240,
              height: 140,
              borderWidth: 0.6,
              marginHorizontal: 8,
            }}
            className=" rounded-lg border-cardBg p-[1.5px]"
          >
            <Image
              source={{ uri: item.imageUrl }}
              className=" h-full rounded-lg"
            />
          </View>
        )}
      />
    </View>
  );
};

export default Slider;
