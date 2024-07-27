import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import get_the_first_n_words from "@/functions/trimWord";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import ImageUploader from "@/components/imageUploader";
import useImageStore from "@/context/image";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import socialMediaPlatforms from "@/constant/social";

interface Post {
  id: string;
  category: string;
  description: string;
  imageUrl: string;
  link: string;
  title: string;
}

export default function Profile() {
  const router = useRouter();
  const { user } = useUser();
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [editData, setEditData] = useState<Post | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState(editData?.category!);
  const [editing, setEditing] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const postsQuery = query(
        collection(db, "posts"),
        where("authorId", "==", user?.primaryEmailAddress?.emailAddress)
      );

      const querySnapshot = await getDocs(postsQuery);
      const posts = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as Post),
        id: doc.id,
      }));

      setData(posts);
    } catch (error) {
      console.error("Error fetching posts: ", error);
    } finally {
      setLoading(false);
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

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
    setDisabled(true);
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
        `https://api.cloudinary.com/v1_1/${process.env
          .EXPO_PUBLIC_CLOUD_NAME!}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { secure_url } = response.data;
      setImage(secure_url);
      console.log(secure_url);
      setEditData({ ...editData, imageUrl: secure_url } as Post);
      setDisabled(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
    setSelectedOption(editData?.category!);
  }, [fetchPosts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const confirmDelete = (postId: string) => {
    setPostToDelete(postId);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      await deleteDoc(doc(db, "posts", postToDelete));
      setData((prevData) =>
        prevData.filter((post) => post.id !== postToDelete)
      );
      setModalVisible(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  const openEditModal = (post: Post) => {
    setPostToEdit(post);
    setEditData(post);
    setEditModalVisible(true); // Ensure the modal is set to visible
  };

  const handleEdit = async () => {
    setEditing(true);
    if (!postToEdit || !editData) return;
    try {
      await updateDoc(doc(db, "posts", postToEdit.id), {
        ...editData,
      });
      setData((prevData) =>
        prevData.map((post) => (post.id === postToEdit.id ? editData : post))
      );
      setEditing(false);
      setEditModalVisible(false);
      setPostToEdit(null);
    } catch (error) {
      console.error("Error updating post: ", error);
    }
  };

  const renderPostItem = (item: Post) => (
    <View
      className="border border-[#282834] p-4 bg-card rounded-2xl mb-4 mx-2"
      key={item.id}
    >
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          className="h-28 w-full rounded-lg mb-2"
        />
      )}
      <View className="flex flex-row justify-between">
        <Text className="text-xl font-outfit-medium text-gray-400 font-medium mb-2">
          {item.title}
        </Text>
        <Text className="text-lg text-gray-500 font-medium">
          #{item.category}
        </Text>
      </View>
      <Text className="text-base text-emerald-500 mb-2">
        {get_the_first_n_words(item.description, 30)}
      </Text>

      <View className="flex flex-row gap-5 mx-5 mt-3">
        <TouchableOpacity
          className="flex flex-row py-1 bg-[#1c1c24] border-[#2e2e3a] border-[0.9px] justify-center px-2 items-center rounded"
          onPress={() => openEditModal(item)} // Correctly bind the item to the edit modal function
        >
          <MaterialIcons name="edit" size={20} color="#eab308" />
          <Text className="font-outfit-regular text-yellow-500 text-lg">
            {" "}
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="px-2 py-1 flex flex-row justify-center bg-[#1c1c24] border-[#2e2e3a] border-[0.9px] items-center rounded"
          onPress={() => confirmDelete(item.id)}
        >
          <MaterialIcons name="delete" size={19} color="#ef4444" />
          <Text className="font-outfit-regular text-lg text-red-500">
            {" "}
            Delete
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/postDetail/${item.id}`)}
          className="px-2 py-1 flex flex-row justify-center bg-[#1c1c24] border-[#2e2e3a] border-[0.9px] items-center rounded"
        >
          <MaterialCommunityIcons
            name="open-in-new"
            size={18}
            color="#60a5fa"
          />
          <Text className="font-outfit-regular text-lg text-blue-400">
            {" "}
            Read
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView
      className="min-h-screen bg-background px-4 pt-4"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#10b981"]}
          tintColor={"#10b981"}
          progressBackgroundColor={"#000000"}
        />
      }
    >
      <View className="mb-32">
        <Text className="text-2xl font-medium text-emerald-500 mb-4">
          Profile
        </Text>

        <View className="h-36 w-full mb-6 items-center">
          <Image
            source={{ uri: user?.imageUrl }}
            className="h-full w-36 rounded-full border-4 border-emerald-500"
          />
          <Text className="text-emerald-500 font-medium text-xl mt-2">
            {user?.fullName}
          </Text>
          <Text className="text-emerald-500 font-light text-lg">
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        <View className=" flex flex-row justify-between items-center  mb-2 mt-10 mr-5">
          <Text className="font-medium text-emerald-500 text-2xl font-outfit-regular mx-5 py-3">
            My Posts
          </Text>

          <TouchableOpacity
            onPress={() => {
              router.push("/post");
            }}
            className=" py-1 justify-center items-center bg-emerald-500 flex-row gap-2 pr-4 pl-2 rounded-xl"
          >
            <Feather
              name="plus"
              size={22}
              color="#17151c"
              // className=" mt-1"
            />
            <Text className=" font-outfit-medium text-xl">New Post</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator size="large" color="#10b981" className="mb-4" />
        )}

        {data.map(renderPostItem)}

        {/* Delete Confirmation Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <BlurView
            intensity={80}
            style={{ flex: 1 }}
            tint="systemChromeMaterialDark"
          >
            <View className="flex-1 justify-center items-center mx-2">
              <View className="bg-background p-5 rounded-xl shadow-lg">
                <Text className="text-xl font-outfit-medium mb-4 text-emerald-500">
                  Confirm Deletion
                </Text>
                <Text className="text-lg text-gray-400 mb-6 font-outfit-regular">
                  Are you sure you want to delete this post? This action cannot
                  be undone.
                </Text>
                <View className="flex flex-row justify-between items-center">
                  <TouchableOpacity
                    className="flex flex-row py-1 bg-[#1c1c24] border-[#2e2e3a] border-[0.9px] justify-center px-2 items-center rounded"
                    onPress={handleDelete}
                  >
                    <Text className=" text-xl font-outfit-regular  text-red-500">
                      Delete
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex flex-row py-1 bg-[#1c1c24] border-[#2e2e3a] border-[0.9px] justify-center px-2 items-center rounded"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className=" text-xl font-outfit-regular  text-emerald-500">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BlurView>
        </Modal>

        {/* Edit Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => {
            setEditModalVisible(!editModalVisible);
          }}
        >
          <BlurView
            intensity={90}
            style={{ flex: 1 }}
            tint="systemChromeMaterialDark"
          >
            <View className="flex-1 justify-center items-center mx-5">
              <View className="bg-background p-5 rounded-xl shadow-lg">
                <Text className="text-xl font-medium mb-4 font-outfit-medium text-emerald-500">
                  Edit Post
                </Text>
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
                      source={{ uri: image || editData?.imageUrl }}
                      // style={styles.image}
                      className=" h-24 w-full"
                    />
                  </TouchableOpacity>
                </View>

                <Text className=" font-outfit-regular text-emerald-500">
                  Title
                </Text>
                <TextInput
                  value={editData?.title}
                  onChangeText={(text) =>
                    setEditData({ ...editData, title: text } as Post)
                  }
                  placeholder="Title"
                  className="text-white mb-4 border-b border-gray-700 font-outfit-regular"
                />

                <Text className=" font-outfit-regular text-emerald-500">
                  Description
                </Text>
                <TextInput
                  value={editData?.description}
                  onChangeText={(text) =>
                    setEditData({ ...editData, description: text } as Post)
                  }
                  placeholder="Description"
                  className="text-white mb-4 border-b border-gray-700 font-outfit-regular"
                  multiline
                />

                <Text className=" font-outfit-regular text-emerald-500">
                  Link
                </Text>
                <TextInput
                  value={editData?.link}
                  onChangeText={(text) =>
                    setEditData({ ...editData, link: text } as Post)
                  }
                  placeholder="Link"
                  className="text-white mb-4 border-b border-gray-700 font-outfit-regular"
                />

                <Text className=" font-outfit-regular text-emerald-500">
                  Shared From
                </Text>
                <View style={{}}>
                  <Picker
                    selectedValue={selectedOption}
                    onValueChange={(itemValue) => {
                      setSelectedOption(itemValue);
                      setEditData({ ...editData, category: itemValue } as Post);
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
                    }}
                    dropdownIconColor="#10b981"
                  >
                    {socialMediaPlatforms.map(
                      (item: { name: string }, index) => {
                        return (
                          <Picker.Item
                            key={index}
                            label={item.name}
                            value={item.name}
                          />
                        );
                      }
                    )}
                  </Picker>
                </View>

                <View className="flex flex-row justify-between mt-5">
                  <TouchableOpacity
                    disabled={disabled}
                    className={`${
                      disabled
                        ? " bg-gray-500  "
                        : " bg-[#1c1c24] border-[#2e2e3a] border-[0.9px] "
                    }flex flex-row py-1  justify-center px-2 items-center rounded`}
                    onPress={handleEdit}
                  >
                    <Text
                      className={` ${
                        disabled ? "text-gray-600" : " text-emerald-500"
                      } font-medium text-xl font-outfit-regular `}
                    >
                      {disabled ? (
                        <View className=" flex flex-row items-center gap-2">
                          <ActivityIndicator size={"small"} color={"#9ca3af"} />
                          <Text className=" font-outfit-regular text-gray-400 text-lg">
                            Uploading Image
                          </Text>
                        </View>
                      ) : editing ? (
                        <View className=" flex flex-row items-center gap-2">
                          <ActivityIndicator size={"small"} color={"#9ca3af"} />
                          <Text className=" font-outfit-regular text-gray-400 text-lg">
                            Updating
                          </Text>
                        </View>
                      ) : (
                        "Save"
                      )}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex flex-row py-1 bg-[#1c1c24] border-[#2e2e3a] border-[0.9px] justify-center px-2 items-center rounded"
                    onPress={() => setEditModalVisible(false)}
                  >
                    <Text className="text-red-500 font-medium text-xl font-outfit-regular ">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BlurView>
        </Modal>
      </View>
    </ScrollView>
  );
}
