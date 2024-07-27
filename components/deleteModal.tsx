import { View, Text, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { BlurView } from "expo-blur";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";

interface Post {
  id: string;
  category: string;
  description: string;
  imageUrl: string;
  title: string;
}

export default function DeleteModal() {
  const [data, setData] = useState<Post[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
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
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <BlurView intensity={50} style={{ flex: 1 }} tint="dark">
          <View className="flex-1 justify-center items-center">
            <View className="bg-background p-5 rounded-xl shadow-lg">
              <Text className="text-xl font-medium mb-4 text-emerald-500">
                Confirm Deletion
              </Text>
              <Text className="text-lg text-gray-400 mb-6">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </Text>
              <View className="flex flex-row justify-between">
                <TouchableOpacity
                  className="px-4 py-2 bg-red-500 rounded"
                  onPress={handleDelete}
                >
                  <Text className="text-white font-medium">Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="px-4 py-2 bg-gray-400 rounded"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-white font-medium">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}
