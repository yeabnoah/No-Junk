import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import useImageStore from "@/context/image";

// Default image URL

function ImageUploader({ imageUrl }: { imageUrl: string }) {
  const { image, setImage } = useImageStore();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const uri = result.assets[0].uri;
      setImage(uri);
      uploadImage(uri);
    }
  };

  const uploadImage = async (uri: string) => {
    const uriParts = uri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });
    formData.append("upload_preset", process.env.EXPO_PUBLIC_PRESET_KEY!);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { secure_url } = response.data;
      setImage(secure_url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className=" h-24 bg-background w-fit">
      <TouchableOpacity onPress={pickImage} className=" ">
        <View className=" h-24 bg-background w-fit -mb-24 z-10 opacity-80 flex items-center justify-center flex-row">
          <View className=" bg-background p-2 border border-emerald-500 rounded-md flex flex-row items-center gap-2">
            <Feather name="edit" size={18} color="#10b981" />
            <Text className=" text-xl font-outfit-medium text-emerald-500">
              Edit
            </Text>
          </View>
        </View>
        <Image
          source={{ uri: image || imageUrl }}
          style={styles.image}
          className=" h-24 w-full"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {},
});

export default ImageUploader;
