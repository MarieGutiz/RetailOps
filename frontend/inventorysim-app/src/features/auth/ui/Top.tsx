// The top section of the registration form, login and forgot password pages.

const Top = ({ text }: { text: string }) => {
  return (
    <div className="mx-auto w-full max-w-md ">
      <img
        src="src/assets/retailsOps.png"
        alt="RetailOps"
        className="mx-auto h-12 w-auto"
      />
      <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-blue-950">
        {text}
      </h2>
    </div>
  );
};

export default Top;
