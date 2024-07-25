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
    <View>
      <Text className=" text-2xl font-outfit-semibold text-emerald-500 mx-5 mt-5 mb-8">
        Popular Posts
      </Text>

      <FlatList
        className=" mt-3 ml-2"
        showsHorizontalScrollIndicator={false}
        data={data}
        horizontal={true}
        renderItem={({ item }) => (
          <View key={item.id}>
            <Image
              source={{ uri: item.imageUrl }}
              style={{
                width: 220,
                height: 140,
                marginHorizontal: 5,
                borderRadius: 10,
                borderColor: "#10b981",
                borderWidth: 1.2,
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

export default Slider;
