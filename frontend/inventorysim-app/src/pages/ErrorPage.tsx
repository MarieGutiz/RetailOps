
  const ErrorPage = ({ code = 500, message = "Unexpected error occurred." }) => {
  const messages: Record<number, string> = {
    401: "You are not authorized.",
    403: "Access forbidden.",
    404: "Page not found.",
    500: "Server error. Please try again later.",
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">Error {code}</h1>
      <p className="text-lg mb-2">{messages[code] || message}</p>
      <a href="/" className="text-blue-500 underline mt-4">
        Go back home
      </a>
    </div>
  );
};


export default ErrorPage