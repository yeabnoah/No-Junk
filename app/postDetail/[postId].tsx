import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
  ToastAndroid,
} from "react-native";

import { AirbnbRating, Rating } from "react-native-ratings";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  arrayUnion,
  doc,
  Firestore,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import { PostInterface } from "@/interface/post";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

const { width, height } = Dimensions.get("window");

// Define the interface for a review
interface Review {
  rate: number;
  comment: string;
  name: string;
  imageUrl: string;
  email: string;
}

export default function PostId() {
  const user = useUser();
  const scrollViewRef = useRef<ScrollView>(null);
  const { postId } = useLocalSearchParams();
  const router = useRouter();
  const stringPostId = String(postId);
  const [data, setData] = useState<PostInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingReview, setLoadingReview] = useState(false);

  const [newRate, setNewRate] = useState(3);
  const [newComment, setNewComment] = useState("");

  const scrollToReviews = () => {
    scrollViewRef.current?.scrollTo({ x: width, animated: true });
  };

  const fetchDetails = useCallback(async () => {
    if (!stringPostId) {
      router.push("/");
      return;
    }

    try {
      const docRef = doc(db, "posts", stringPostId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data() as PostInterface);
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
  }, [stringPostId, router]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (loading) {
    return (
      <View className="min-h-screen bg-background px-5 justify-center items-center">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!data) {
    return (
      <View className="min-h-screen bg-background px-5 justify-center items-center">
        <Text>No data available</Text>
      </View>
    );
  }

  async function addReviewToDocument(
    db: Firestore, // Type the Firestore instance
    docId: string,
    review: Review
  ) {
    try {
      const docRef = doc(db, "posts", docId);
      await updateDoc(docRef, {
        review: arrayUnion(review),
      });
      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating document: ", error);
      throw error; // Re-throw the error if you want to handle it elsewhere
    }
  }

  const openLinkWithApp = async (link: string) => {
    const url = link;

    try {
      // Check if the device can handle the URL
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Error",
          "Unable to open the URL. Make sure the URL is correct."
        );
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const handleSubmit = async () => {
    setLoadingReview(true); // Set loading state to true when the update starts

    const newReview: Review = {
      rate: newRate,
      comment: newComment,
      name: user.user?.firstName ?? "Unknown",
      imageUrl: user.user?.imageUrl ?? "",
      email: user.user?.primaryEmailAddress?.emailAddress ?? "",
    };

    try {
      await addReviewToDocument(db, postId as string, newReview);

      fetchDetails();
      setNewComment("");
      ToastAndroid.show("comment added successfully", ToastAndroid.BOTTOM);
    } catch (error) {
      // Handle error if needed
    } finally {
      setLoadingReview(false); // Set loading state to false when the update completes
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-background">
        <Image
          source={{ uri: data.imageUrl }}
          className="h-[30vh] mt-10 mb-5 rounded-2xl w-[90vw] self-center"
        />

        {/* <TouchableOpacity
          onPress={scrollToReviews}
          className="flex flex-row gap-5 items-center justify-end mx-5 mb-2"
        >
          <Text className="text-right text-lg font-semibold text-emerald-500">
            Swipe to see The Reviews
          </Text>

          <AntDesign name="arrowright" size={24} color="#10b981" />
        </TouchableOpacity> */}

        <ScrollView
          horizontal
          ref={scrollViewRef}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ width: width * 2 }}
          className="flex-1"
        >
          {/* Details Section */}
          <ScrollView style={{ width }}>
            <View className="p-5">
              <Text className="text-emerald-500 font-outfit-medium text-xl mb-2">
                Title :{" "}
                <Text className="text-gray-500 font-outfit-regular text-xl">
                  {" "}
                  {data.title}
                </Text>
              </Text>
              <Text className="text-gray-500 font-outfit-regular text-lg mb-2">
                {data.description}
              </Text>
              <Text className="text-emerald-500 font-outfit-medium text-xl">
                Author:
                <Text className="text-gray-500 font-outfit-regular text-xl">
                  {" "}
                  {data.author}
                </Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  openLinkWithApp(data.link);
                }}
                className=" flex flex-row gap-3  items-center my-5"
              >
                <MaterialIcons
                  name="open-in-browser"
                  size={26}
                  color="#10b981"
                />
                <Text className=" text-emerald-500 font-outfit-medium text-2xl">
                  Open Post in {data.category}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="">
              <View className=" w-full">
                <View className="flex flex-row items-center mx-5 gap-5">
                  <Text className="text-emerald-500 text-xl font-outfit-medium">
                    Rate Post :
                  </Text>

                  <AirbnbRating
                    count={5}
                    reviews={["Terrible", "Bad", "OK", "Good", "Amazing"]}
                    defaultRating={newRate}
                    size={20}
                    showRating={false}
                    selectedColor="#10b981"
                    onFinishRating={(rate: number) => {
                      setNewRate(rate);
                    }}
                  />
                </View>
              </View>

              <TextInput
                value={newComment}
                multiline
                onChangeText={(event: string) => {
                  setNewComment(event);
                }}
                placeholder="Enter review comment"
                placeholderTextColor={"gray"}
                numberOfLines={3}
                className=" border-[.3px] border-emerald-500 text-xl align-top font-outfit-light text-emerald-500 mx-5 px-3 mt-3 rounded pt-2"
              />

              <TouchableOpacity
                disabled={loadingReview}
                onPress={handleSubmit}
                className={`w-fit rounded-lg mx-5 my-5 ${
                  loadingReview ? " bg-gray-400" : "bg-emerald-500"
                }`}
              >
                <Text className="text-center py-2 font-outfit-medium text-xl">
                  {loadingReview ? "Submitting..." : "Submit Review"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Reviews Section */}
          <View style={{ width }}>
            <View className="p-5">
              <Text className="text-emerald-500 font-outfit-medium text-xl mb-2">
                Reviews
              </Text>

              {data.review?.length ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className=" mb-10"
                >
                  {data.review.map((item) => (
                    <View
                      key={Math.random()}
                      className="p-2 border-[.3px] border-gray-600 rounded-md mb-2 pr-3"
                    >
                      <View className=" flex flex-row gap-3 items-center">
                        <Image
                          source={{ uri: item.imageUrl }}
                          className="h-10 w-10 rounded-xl pt-2"
                        />

                        <View className="flex flex-row justify-between flex-1 gap-10">
                          <Text className="ml-1 text-xl font-outfit-regular text-emerald-500">
                            {item.name}
                          </Text>
                          <AirbnbRating
                            count={5}
                            reviews={[
                              "Terrible",
                              "Bad",
                              "OK",
                              "Good",
                              "Amazing",
                            ]}
                            defaultRating={item.rate}
                            size={12}
                            showRating={false}
                            selectedColor="#10b981"
                            isDisabled={true}
                          />
                        </View>
                      </View>
                      <Text className="ml-14 text-lg font-outfit-light text-emerald-500">
                        {item.comment}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <Text className="text-gray-500 font-outfit-regular text-lg">
                  No reviews available
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
