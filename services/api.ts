import { NewPost } from "@/types/new.post";
import { Post } from "@/types/post";

const API_URL = 'https://jsonplaceholder.typicode.com';

export const fetchPostsApi = async (start: number, limit: number): Promise<Post[]> => {
  const response = await fetch(`${API_URL}/posts?_start=${start}&_limit=${limit}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export const fetchPostByIdApi = async (id: number): Promise<Post & { comments: Comment[] }> => {
  const [postResponse, commentsResponse] = await Promise.all([
    fetch(`${API_URL}/posts/${id}`),
    fetch(`${API_URL}/posts/${id}/comments`),
  ]);
  
  if (!postResponse.ok || !commentsResponse.ok) {
    throw new Error('Failed to fetch post data');
  }
  
  const post = await postResponse.json();
  const comments = await commentsResponse.json();
  
  return { ...post, comments };
};

export const createPostApi = async (post: NewPost): Promise<Post> => {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    body: JSON.stringify(post),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  
  if (!response.ok) throw new Error('Failed to create post');
  return response.json();
};