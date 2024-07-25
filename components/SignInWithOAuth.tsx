import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, View, Button, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    //docs.expo.dev/guides/authentication/#improving-user-experience
    https: void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/dashboard", { scheme: "myapp" }),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <SafeAreaView className=" bg-[#17151c]">
      <StatusBar backgroundColor="#17151c" />
      {/* <StatusBar style="dark /> */}
      <View className=" min-h-screen flex-1 flex pt-44 items-center bg-[#17151c] px-5">
        <View className=" ">
          <Image
            source={require("../assets/images/app/loginImage.png")}
            className=" h-72 w-[90vw]"
          />
          <View className=" bg fixed top-10">
            <Text className=" text-center text-white text-4xl font-outfit-bold">
              Welcome to{" "}
              <Text className=" text-emerald-500 font-outfit-extrabold">
                Tatari
              </Text>
              we make{" "}
              <Text className=" text-emerald-500 font-outfit-extrabold">
                Outsourcing{" "}
              </Text>
              easy
            </Text>
            <Text className=" mt-5 font-outfit-light text-balance text-emerald-300 text-center text-[16px] space-y-0">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et.
            </Text>
            <TouchableOpacity
              className=" bg-emerald-500 flex flex-row gap-2 items-center justify-center  w-max rounded-xl mt-10"
              onPress={onPress}
            >
              <Feather name="lock" size={18} color="#17151c" />
              <Text className=" text-[#17151c] text-2xl font-outfit-regular text-center py-3">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default SignInWithOAuth;
