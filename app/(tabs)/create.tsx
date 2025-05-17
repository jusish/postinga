import { View, TextInput, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { useAppDispatch } from "@/hooks/hooks";
import { createPost } from "@/slices/posts.slice";

export default function CreatePostScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [post, setPost] = useState({
    title: "",
    body: "",
    userId: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!post.title.trim() || !post.body.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill all fields",
        position: "bottom"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(createPost(post)).unwrap();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Post created successfully",
        position: "bottom"
      });
      setPost({ title: "", body: "", userId: 1 });
      router.push("/(tabs)");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create post",
        position: "bottom"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 p-4 bg-slate-50">
      <Text className="text-xl font-bold text-slate-800 mb-4">
        Create New Post
      </Text>

      <TextInput
        className="p-4 mb-4 bg-white rounded-lg border border-slate-200"
        placeholder="Post title"
        placeholderTextColor="#94a3b8"
        value={post.title}
        onChangeText={(text) => setPost({ ...post, title: text })}
      />

      <TextInput
        className="p-4 mb-4 bg-white rounded-lg border border-slate-200 h-40 text-align-top"
        placeholder="What's on your mind?"
        placeholderTextColor="#94a3b8"
        multiline
        value={post.body}
        onChangeText={(text) => setPost({ ...post, body: text })}
      />

      <Pressable
        className={`p-4 rounded-lg ${
          isSubmitting ? "bg-blue-400" : "bg-blue-600"
        }`}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text className="text-white text-center font-bold">
          {isSubmitting ? "Posting..." : "Post"}
        </Text>
      </Pressable>
    </View>
  );
}
