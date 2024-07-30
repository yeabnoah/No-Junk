import { Redirect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{ backgroundColor: "#17151c" }}
      className=" flex-1 bg-background"
    >
      <StatusBar backgroundColor="#17151c" style="light" />
      <Redirect href="/home" />
    </View>
  );
}
