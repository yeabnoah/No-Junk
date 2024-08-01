import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { collection, addDoc } from "firebase/firestore";
import socialMediaPlatforms from "@/constant/social";
import { db } from "@/configs/firebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { Redirect, router } from "expo-router";

export default function CreatePost() {
  const [image, setImage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const user = useUser();
  const [posting, setPosting] = useState(false);

  const defaultImage =
    "https://media.licdn.com/dms/image/D5612AQGA_E-rvcfi3w/article-cover_image-shrink_720_1280/0/1706066503702?e=2147483647&v=beta&t=dTdcYn1MoUN86znud8LsdLmJIprSXKPLEx0s3jTZ82s";

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
    setDisabled(true);
    setLoading(true); // Set loading to true

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
    } finally {
      setLoading(false); // Set loading to false
      setDisabled(false); // Enable the button
    }
  };

  const handlePost = async () => {
    setPosting(true);
    if (!title || !description || !link || !selectedOption || !image) {
      alert("Please fill in all fields");
      return;
    }

    setDisabled(true); // Prevent multiple post attempts

    try {
      await addDoc(collection(db, "posts"), {
        author: user.user?.firstName,
        authorId: user.user?.primaryEmailAddress?.emailAddress,
        title,
        description,
        link,
        imageUrl: image,
        category: selectedOption,
        createdAt: new Date(),
      });
      ToastAndroid.show("Post Created successfully", ToastAndroid.BOTTOM);
      setTitle("");
      setDescription("");
      setLink("");
      setImage("");
      setSelectedOption("");
      router.push("/profile");
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setDisabled(false); // Re-enable the button after post creation
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={47}>
      <View className="min-h-screen bg-background px-5 py-3">
        <Text className=" text-2xl font-outfit-medium text-emerald-500">
          New Post
        </Text>

        <View className="bg-background w-fit">
          <TouchableOpacity
            onPress={pickImage}
            className="mt-5"
            disabled={disabled}
          >
            <Image
              source={
                image
                  ? { uri: image }
                  : require("./../assets/images/app/uuu.png")
              }
              className="h-52 w-full rounded-xl"
            />

            <View className="mt-5 bg-background w-fit flex items-center justify-center flex-row">
              <View className="bg-background p-2 border border-emerald-500 rounded-md flex flex-row items-center gap-2">
                <Feather name="plus" size={18} color="#10b981" />
                <Text className="text-xl font-outfit-medium text-emerald-500">
                  Add Picture
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="mt-5 text-xl font-outfit-regular text-emerald-500">
            Title
          </Text>
          <TextInput
            value={title}
            placeholderTextColor={"gray"}
            onChangeText={(text) => setTitle(text)}
            placeholder="Enter your post title"
            className="text-white mb-4 text-lg px-2 border-b border-gray-700 font-outfit-regular"
          />

          <Text className="text-xl font-outfit-regular text-emerald-500">
            Description
          </Text>
          <TextInput
            value={description}
            multiline
            numberOfLines={2}
            placeholderTextColor={"gray"}
            onChangeText={(text) => setDescription(text)}
            placeholder="Enter your post description"
            className="text-white align-top border rounded px-5 py-3 mt-2 text-lg border-b border-gray-700 font-outfit-regular"
          />

          <Text className="mt-5 text-xl font-outfit-regular text-emerald-500">
            Link
          </Text>
          <TextInput
            value={link}
            placeholderTextColor={"gray"}
            onChangeText={(text) => setLink(text)}
            placeholder="Enter your post link"
            className="text-white mb-4 text-lg px-2 border-b border-gray-700 font-outfit-regular"
          />

          <Text className="text-xl font-outfit-regular text-emerald-500">
            Shared From
          </Text>
          <View>
            <Picker
              selectedValue={selectedOption}
              onValueChange={(itemValue) => {
                setSelectedOption(itemValue);
              }}
              style={{
                backgroundColor: "#17151c",
                color: "#10b981",
                height: 50,
                width: "100%",
                fontFamily: "Outfit-Regular",
                paddingHorizontal: 10,
                borderWidth: 2,
                borderColor: "white",
                fontSize: 20,
              }}
              dropdownIconColor="#10b981"
            >
              {socialMediaPlatforms.map((item, index) => (
                <Picker.Item key={index} label={item.name} value={item.name} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            className={`rounded mt-5 ${
              posting || loading ? "bg-gray-500" : "bg-emerald-500"
            }  items-center justify-center`}
            onPress={handlePost}
            disabled={disabled || loading || posting}
          >
            {loading ? (
              <View className=" flex flex-row items-center gap-5">
                <ActivityIndicator color="#fff" className=" my-3" />
                <Text className=" text-xl font-outfit-regular text-white">
                  Uploading Image ...
                </Text>
              </View>
            ) : // Show loading indicator
            posting ? (
              <Text className="text-background text-center text-2xl font-outfit-regular py-2 ">
                Posting ...
              </Text>
            ) : (
              <Text className="text-background text-center text-2xl font-outfit-regular py-2 ">
                Post
              </Text>
            )}
          </TouchableOpacity>
          <View className="min-h-screen"></View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
