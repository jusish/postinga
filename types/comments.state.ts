import { Comment } from "./comment";

export interface CommentsState {
  commentsByPostId: Record<number, Comment[]>;
  loading: boolean;
  error: string | null;
}
