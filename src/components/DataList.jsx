import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../app/listSlice";
import SkeletonList from "./SkeletonList";

const DataList = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector((state) => state.list);

  return (
    <div className="p-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => dispatch(fetchData())}
      >
        Fetch Data
      </button>

      {isLoading ? <SkeletonList /> : <ul>{data.map((item, index) => <li key={index}>{item}</li>)}</ul>}
    </div>
  );
};

export default DataList;
