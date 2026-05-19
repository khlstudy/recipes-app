import type { Comment } from "../../../types";

export interface CommentListProps {
  comments: Comment[];
  authorNames?: Record<string, string>;
  emptyMessage?: string;
}
