import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/lottie/loader.json"; // Add your Lottie JSON file
import { useSelector } from "react-redux";

const Loader = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);

  if (!isLoading) return null; // Don't render if not loading

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="w-40 h-40">
        <Lottie animationData={loadingAnimation} loop autoPlay />
      </div>
    </div>
  );
};

export default Loader;
