import { createComment, fetchComments } from "@/services/api";
import { CommentsState } from "@/types/comments.state";
import { createAsyncThunk, createSlice, Draft } from "@reduxjs/toolkit";
import { Comment } from "@/types/comment";
import { NewComment } from "@/types/new.comment";

const initialState: CommentsState = {
  commentsByPostId: {},
  loading: false,
  error: null
};

export const getComments = createAsyncThunk(
  "comments/getComments",
  async (postId: number) => {
    const comments = await fetchComments(postId);
    return { postId, comments };
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({
    postId,
    commentData
  }: {
    postId: number;
    commentData: NewComment;
  }) => {
    const comment = await createComment(postId, commentData);
    return { postId, comment };
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, comments } = action.payload;
        state.commentsByPostId[postId] = comments as Draft<Comment>[];
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch comments";
      })
      .addCase(addComment.pending, (state) => {
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (!state.commentsByPostId[postId]) {
          state.commentsByPostId[postId] = [];
        }
        state.commentsByPostId[postId].unshift(comment as Draft<Comment>);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.error.message || "Failed to add comment";
      });
  }
});

export const commentsReducer = commentsSlice.reducer;
