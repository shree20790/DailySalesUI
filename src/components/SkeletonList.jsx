const SkeletonList = () => {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-6 w-full bg-gray-300 animate-pulse rounded"></div>
        ))}
      </div>
    );
  };
  
  export default SkeletonList;
  