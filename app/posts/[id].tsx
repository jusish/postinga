import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchPostById } from "@/slices/posts.slice";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { currentPost, loading, error } = useAppSelector(
    (state) => state.posts
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(Number(id)));
    }
  }, [id]);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error,
      });
    }
  }, [error]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!currentPost) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <Text className="text-slate-500">Post not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="bg-white rounded-lg p-6 shadow-sm">
        <Text className="text-2xl font-bold text-slate-800 mb-2">
          {currentPost.title}
        </Text>
        <Text className="text-slate-600 mb-6">{currentPost.body}</Text>

        <View className="border-t border-slate-200 pt-4">
          <Text className="text-lg font-semibold text-slate-800 mb-4">
            Comments
          </Text>

          {currentPost.comments?.length ? (
            currentPost.comments.map((comment: any) => (
              <View
                key={comment.id}
                className="mb-4 pb-4 border-b border-slate-100"
              >
                <Text className="font-medium text-slate-800">
                  {comment.name}
                </Text>
                <Text className="text-slate-600 mt-1">{comment.body}</Text>
                <Text className="text-slate-400 text-sm mt-2">
                  {comment.email}
                </Text>
              </View>
            ))
          ) : (
            <View className="items-center py-6">
              <Ionicons name="chatbubble-outline" size={32} color="#94a3b8" />
              <Text className="text-slate-500 mt-2">No comments yet</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
