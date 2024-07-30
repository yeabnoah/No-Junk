import { Stack } from "expo-router";
import "../global.css";
import * as SecureStore from "expo-secure-store";
import { useFonts } from "expo-font";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignInWithOAuth from "@/components/SignInWithOAuth";

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = "pk_test_ZnJhbmsteWFrLTg4LmNsZXJrLmFjY291bnRzLmRldiQ";

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export default function RootLayout() {
  useFonts({
    "Outfit-Thin": require("../assets/fonts/Outfit-Thin.ttf"),
    "Outfit-Light": require("../assets/fonts/Outfit-Light.ttf"),
    "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
    "Outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "Outfit-SemiBold": require("../assets/fonts/Outfit-SemiBold.ttf"),
    "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "Outfit-ExtraBold": require("../assets/fonts/Outfit-ExtraBold.ttf"),
    "Outfit-Black": require("../assets/fonts/Outfit-Black.ttf"),
  });
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <SignedIn>
          <KeyboardAvoidingView
            enabled
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background"
            style={{ backgroundColor: "#17151c" }}
          >
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#17151c",
                },
                headerShown: false,
                statusBarHidden: false,
                statusBarStyle: "light",
                statusBarTranslucent: false,
                statusBarColor: "#121217",
                animation: "ios",
                navigationBarColor: "#17151c",
              }}
            >
              <Stack.Screen
                name="(tabs)"
                options={{
                  navigationBarColor: "#17151c",
                  animation: "ios",
                }}
              />

              <Stack.Screen
                name="index"
                options={{
                  navigationBarColor: "#17151c",
                  animation: "ios",
                }}
              />
            </Stack>
          </KeyboardAvoidingView>
        </SignedIn>

        <SignedOut>
          <SignInWithOAuth />
        </SignedOut>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
