// A separator

const Divider = ({ text }: { text: string }) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-gray-300"></div>
        <span className="text-gray-500 text-xs">{text}</span>
        <div className="h-px flex-1 bg-gray-300"></div>
      </div>
    </>
  );
};

export default Divider;
