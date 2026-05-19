import type { IconProps } from "./types";

const Icon = ({ src, size = 16, className }: IconProps) => {
  const isSprite = src.includes("#");

  if (isSprite) {
    return (
      <svg
        width={size}
        height={size}
        className={className}
        focusable="false"
        aria-hidden="true">
        <use href={src} />
      </svg>
    );
  }

  return (
    <img
      src={src}
      width={size}
      height={size}
      className={className}
      alt=""
      aria-hidden="true"
    />
  );
};

export default Icon;
