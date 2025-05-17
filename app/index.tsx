import { View, Text, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "../global.css";
import { useAppDispatch } from "@/hooks/hooks";
import { fetchPosts } from "@/slices/posts.slice";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const prepare = async () => {
      try {
        await dispatch<any>(fetchPosts({ start: 0, limit: 10 }));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
        router.replace("/(tabs)");
      }
    };

    prepare();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-slate-50">
      <Text className="text-3xl font-bold text-blue-600 mb-4">PostStack</Text>
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}
