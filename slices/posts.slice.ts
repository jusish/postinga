// store/postsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NewPost } from '@/types/new.post';
import { Post } from '@/types/post';
import { fetchPostsApi, fetchPostByIdApi, createPostApi } from '@/services/api';

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  hasMore: true,
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ start = 0, limit = 10 }: { start: number; limit: number }) => {
    const response = await fetchPostsApi(start, limit);
    return response;
  }
);

export const fetchMorePosts = createAsyncThunk(
  'posts/fetchMorePosts',
  async ({ start = 0, limit = 10 }: { start: number; limit: number }) => {
    const response = await fetchPostsApi(start, limit);
    return response;
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id: number) => {
    const response = await fetchPostByIdApi(id);
    return response;
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (post: NewPost) => {
    const response = await createPostApi(post);
    return response;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.hasMore = action.payload.length === 10;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      
      // Fetch More Posts
      .addCase(fetchMorePosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMorePosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = [...state.posts, ...action.payload];
        state.hasMore = action.payload.length === 10;
      })
      .addCase(fetchMorePosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch more posts';
      })
      
      // Fetch Post By ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPost = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch post';
      })
      
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create post';
      });
  },
});

export const postsReducer = postsSlice.reducer;