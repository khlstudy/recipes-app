import CommentItem from "../comment-item/CommentItem";
import type { CommentListProps } from "./types";
import styles from "./CommentList.module.scss";

const CommentList = ({
  comments,
  authorNames,
  emptyMessage = "No reviews yet. Be the first to leave one!",
}: CommentListProps) => {
  if (comments.length === 0) {
    return <p className={styles["comment-list__empty"]}>{emptyMessage}</p>;
  }

  return (
    <ul className={styles["comment-list"]}>
      {comments.map((comment) => (
        <li key={comment.id} className={styles["comment-list__item"]}>
          <CommentItem
            comment={comment}
            authorName={authorNames?.[comment.userId]}
          />
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
