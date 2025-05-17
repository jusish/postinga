import { Post } from "./post";

export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}
