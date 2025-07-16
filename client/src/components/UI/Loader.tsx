import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ size = "xl", fullScreen = true }) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div
          className={`${sizes[size]} border-4 border-blue-500 border-t-transparent rounded-full animate-spin`}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-4 border-blue-500 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};

export default Loader;
