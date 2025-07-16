// utils/placeholders.ts
export const getPlaceholderImage = (
  width: number,
  height: number,
  text = "",
  bgColor = "f0f0f0",
  textColor = "333"
) => {
  const baseUrl = "https://dummyimage.com";
  return `${baseUrl}/${width}x${height}/${bgColor}/${textColor}.png${
    text ? `&text=${encodeURIComponent(text)}` : ""
  }`;
};
