import Icon from "../../common/icon/Icon";
import { classNames } from "../../../utils/classNames";
import { ICONS_PATH, RECIPE_ICON_IDS } from "../../common/recipe-card/utils";
import { formatDate, getInitial, STARS } from "./utils";
import type { CommentItemProps } from "./types";
import styles from "./CommentItem.module.scss";

const CommentItem = ({ comment, authorName }: CommentItemProps) => (
  <article className={styles["comment-item"]}>
    <div className={styles["comment-item__avatar"]} aria-hidden="true">
      {getInitial(authorName)}
    </div>
    <div className={styles["comment-item__body"]}>
      <header className={styles["comment-item__header"]}>
        <div className={styles["comment-item__meta"]}>
          <span className={styles["comment-item__author"]}>
            {authorName ?? "Anonymous"}
          </span>
          <time
            className={styles["comment-item__date"]}
            dateTime={comment.createdAt}>
            {formatDate(comment.createdAt)}
          </time>
        </div>
        <div
          className={styles["comment-item__stars"]}
          aria-label={`${comment.rating} out of 5 stars`}>
          {STARS.map((position) => (
            <Icon
              key={position}
              src={`${ICONS_PATH}${RECIPE_ICON_IDS.star}`}
              size={14}
              className={classNames(
                styles["comment-item__star"],
                position <= comment.rating
                  ? styles["comment-item__star--filled"]
                  : styles["comment-item__star--empty"]
              )}
            />
          ))}
        </div>
      </header>
      <p className={styles["comment-item__text"]}>{comment.text}</p>
    </div>
  </article>
);

export default CommentItem;
