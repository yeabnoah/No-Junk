import { Stack, Tabs } from "expo-router";
import "../../global.css";
import { Feather, FontAwesome, Octicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#10b981",
        tabBarStyle: {
          backgroundColor: "#17151c",
          borderColor: "transparent",
          borderWidth: 0,
          shadowOpacity: 0,
          shadowColor: "#10b981",
          paddingBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarVisibilityAnimationConfig: {},
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={23} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Discover",

          tabBarIcon: ({ color }) => (
            <Octicons name="feed-rocket" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
