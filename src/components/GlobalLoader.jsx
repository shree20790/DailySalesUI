import { useSelector } from "react-redux";

const GlobalLoader = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);

  return isLoading ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="text-white text-lg font-bold">Loading...</div>
    </div>
  ) : null;
};

export default GlobalLoader;
