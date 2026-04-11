import { Navigate, Outlet } from "react-router-dom";
import { useShowProfile } from "../hooks/profile/useShowProfile";

const ProtectedRoute = () => {
  const { data: user, isLoading } = useShowProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Not logged in → redirect
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
