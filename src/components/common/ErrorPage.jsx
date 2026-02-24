import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = ({ code = "404", message = "Page Not Found" }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl text-center p-6">
        <h1 className="text-6xl font-bold text-error">{code}</h1>

        <p className="mt-4 text-lg">{message}</p>

        <Link to="/" className="btn btn-primary mt-6">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
