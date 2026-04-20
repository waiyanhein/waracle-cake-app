export const Loading = () => {
  return (
    <div className="animate-pulse h-48 rounded-xl">
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    </div>
  );
};
