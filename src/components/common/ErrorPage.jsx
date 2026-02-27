import { Link } from "react-router-dom";

const ErrorPage = ({
  code = "404",
  message = "Page Not Found",
  subMessage = "The page you're looking for doesn't exist.",
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl text-center p-8 gap-2">
        <h1 className="text-7xl font-bold text-error">{code}</h1>
        <p className="text-xl font-semibold mt-2">{message}</p>
        <p className="text-sm text-base-content/50">{subMessage}</p>
        <Link to="/" className="btn btn-primary mt-4">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
