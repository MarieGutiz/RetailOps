import { useNavigate } from 'react-router-dom';

//Error page component to display user-friendly error messages for common 
// HTTP status codes (401, 403, 404, 500).

interface ErrorPageProps {
  code?: number;
  message?: string;
}

const ErrorPage = ({ code = 500, message }: ErrorPageProps) => {
  const navigate = useNavigate();

  const messages: Record<number, { title: string; desc: string }> = {
    401: {
      title: 'You need to log in',
      desc: 'Please sign in to access this page. If you already have an account, log in below.',
    },
    403: {
      title: 'Access denied',
      desc: 'You don’t have permission to view this page. Contact support if you think this is a mistake.',
    },
    404: {
      title: 'Page not found',
      desc: 'The page you’re looking for doesn’t exist or was moved. Please check the URL or return home.',
    },
    500: {
      title: 'Something went wrong',
      desc: 'Our system encountered an issue. Please refresh the page or try again later.',
    },
  };

  const { title, desc } = messages[code] || {
    title: 'Unexpected error',
    desc: message || 'An unexpected error occurred. Please try again.',
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center px-6">
      <h1 className="text-6xl font-extrabold text-red-600 mb-4">{code}</h1>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 max-w-md mb-6">{desc}</p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-black font-medium px-4 py-2 rounded-md"
        >
          Go Home
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-md"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
