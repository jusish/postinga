import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchMorePosts, fetchPosts } from "@/slices/posts.slice";

export default function FeedScreen() {
  const dispatch = useAppDispatch();
  const { posts, loading, error, hasMore } = useAppSelector(
    (state) => state.posts
  );
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch<any>(fetchPosts({ start: 0, limit: 10 }));
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to refresh posts",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleEndReached = async () => {
    if (!loading && hasMore) {
      try {
        await dispatch(fetchMorePosts({ start: posts.length, limit: 10 }));
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load more posts",
        });
      }
    }
  };

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error,
      });
    }
  }, [error]);

  return (
    <View className="flex-1 bg-slate-50">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
            
          />
        }
        ListHeaderComponent={
          <View className="p-4 bg-white border-b border-slate-200">
            <Text className="text-2xl font-bold text-slate-800">
              Recent Posts
            </Text>
            <Text className="text-slate-500 mt-1">
              What's new in your network
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Link href={`/posts/${item.id}`} asChild>
            <Pressable className="p-4 mb-2 bg-white mx-2 rounded-lg shadow-sm">
              <Text className="text-lg font-semibold text-slate-800">
                {item.title}
              </Text>
              <Text className="text-slate-600 mt-2">{item.body}</Text>
              <View className="flex-row items-center mt-3">
                <Ionicons name="chatbubble-outline" size={16} color="#64748b" />
                <Text className="text-slate-500 ml-1 text-sm">
                  {item.comments ? item.comments.length : 0} comments
                </Text>
              </View>
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="flex-1 items-center justify-center p-4">
              <Text className="text-slate-500">No posts yet</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading && posts.length > 0 ? (
            <ActivityIndicator size="small" color="#3b82f6" className="my-4" />
          ) : null
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
